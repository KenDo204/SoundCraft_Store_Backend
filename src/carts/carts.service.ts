import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, IsNull } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { Product } from '@/products/entities/product.entity';
import { UpsertCartItemDto, UpdateCartItemQuantityDto, UpdateCartItemNoteDto, BulkDeleteCartItemsDto } from './dto/cart.dto';
import { InsufficientStockException, MaxOrderQuantityExceededException, ProductBannedException } from './cart.exceptions';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  // ==========================================
  // LÕI LOGIC: VALIDATION & THRESHOLD CALCULATION
  // ==========================================
  private validateInventoryAndLimit(
    status: string, 
    stock: number, 
    lockedStock: number = 0, 
    maxOrderQuantity: number = 0, 
    requestedQuantity: number
  ) {
    // 1. Check Status (Inactive)
    if (status !== 'ACTIVE') {
      throw new ProductBannedException();
    }

    // Nếu maxOrderQuantity = 0 (Không cấu hình), mặc định gán bằng stock_quantity
    const effectiveMaxOrder = maxOrderQuantity > 0 ? maxOrderQuantity : stock;

    // 2. Xác định Limit (Threshold Calculation)
    let limit = 99; // Mặc định hệ thống
    let available = stock;

    if (stock === -1) {
      // Trường hợp 1: Vô hạn
      limit = effectiveMaxOrder > 0 ? Math.min(99, effectiveMaxOrder) : 99;
    } else {
      // Trường hợp 2: Hữu hạn
      available = stock - lockedStock;
      if (available <= 0) throw new InsufficientStockException(0);
      
      limit = effectiveMaxOrder > 0 ? Math.min(available, effectiveMaxOrder) : available;
    }

    // 3. Xác thực số lượng yêu cầu
    if (requestedQuantity > limit) {
      if (stock !== -1 && requestedQuantity > available) {
        throw new InsufficientStockException(available);
      } else {
        throw new MaxOrderQuantityExceededException(limit);
      }
    }

    return true; // Hợp lệ
  }

  // ==========================================
  // LUỒNG GET CART & SOFT DISABLE
  // ==========================================
  async getCart(userId: number) {
    let cart = await this.cartRepo.findOne({
      where: { user: { user_id: userId } },
      relations: ['items', 'items.product', 'items.product.images'],
    });

    if (!cart) {
      cart = await this.cartRepo.save(this.cartRepo.create({ user: { user_id: userId } }));
      return { items: [], totalCartMoney: 0 };
    }

    let totalCartMoney = 0;

    // Mapping items để FE hiển thị trạng thái (Soft Disable)
    const mappedItems = cart.items.map(item => {
      const p = item.product;
      
      const currentStock = p.stock_quantity;
      const currentPrice = p.price;
      const lockedStock = 0; // Thay bằng logic tính hàng đang hold nếu có

      const maxOrder = p.max_order_quantity > 0 ? p.max_order_quantity : currentStock;

      const thumbnailImg = p.images?.find(img => img.is_thumbnail === true);
      const imageUrl = thumbnailImg ? thumbnailImg.image_url : (p.images?.[0]?.image_url || null);

      let isAvailable = true;
      let disableReason: string | null = null;

      if (p.status !== 'ACTIVE') {
        isAvailable = false;
        disableReason = 'Sản phẩm tạm ngưng hoạt động';
      } else if (currentStock !== -1 && (currentStock - lockedStock) <= 0) {
        isAvailable = false;
        disableReason = 'Hết hàng';
      }

      // Chỉ tính tiền những item hợp lệ
      if (isAvailable) {
        item.total_money = currentPrice * item.quantity;
        totalCartMoney += item.total_money;
      }

      return {
        ...item,
        imageUrl: imageUrl,
        isAvailable,
        disableReason,
        currentPrice,
        maxAllowedQuantity: maxOrder,
      };
    });

    return {
      cart_id: cart.cart_id,
      items: mappedItems,
      totalCartMoney,
    };
  }

  // ==========================================
  // LUỒNG THÊM / CẬP NHẬT (UPSERT)
  // ==========================================
  async upsertCartItem(userId: number, dto: UpsertCartItemDto) {
    let cart = await this.cartRepo.findOne({ where: { user: { user_id: userId } }, relations: ['items'] });
    if (!cart) cart = await this.cartRepo.save(this.cartRepo.create({ user: { user_id: userId } }));

    const product = await this.productRepo.findOne({ where: { product_id: dto.productId } });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    let stock = product.stock_quantity;
    let price = product.price;

    // Kiểm tra xem item đã có trong giỏ chưa
    const existingItem = await this.cartItemRepo.findOne({
      where: { 
        cart: { cart_id: cart.cart_id }, 
        product: { product_id: dto.productId } 
      }
    });

    const targetQuantity = existingItem ? existingItem.quantity + dto.quantity : dto.quantity;

    // GỌI HÀM VALIDATE LÕI
    this.validateInventoryAndLimit(
      product.status, 
      stock, 
      0, // lockedStock
      product.max_order_quantity || 99, // maxOrderQuantity (Sửa lại lấy từ product nếu có)
      targetQuantity
    );

    if (existingItem) {
      existingItem.quantity = targetQuantity;
      existingItem.total_money = targetQuantity * price;
      if (dto.note) existingItem.note = dto.note;
      return this.cartItemRepo.save(existingItem);
    } else {
      const newItem = this.cartItemRepo.create({
        cart,
        product,
        quantity: targetQuantity,
        note: dto.note,
        total_money: targetQuantity * Number(price),
      });
      return this.cartItemRepo.save(newItem);
    }
  }

  // ==========================================
  // CÁC LUỒNG KHÁC (UPDATE SL, ĐỔI NOTE, XÓA)
  // ==========================================
  async updateQuantity(userId: number, cartItemId: number, dto: UpdateCartItemQuantityDto) {
    const item = await this.cartItemRepo.findOne({
      where: { cart_item_id: cartItemId, cart: { user: { user_id: userId } } },
      relations: ['product']
    });
    if (!item) throw new NotFoundException('Không tìm thấy sản phẩm trong giỏ');

    const stock = item.product.stock_quantity;
    const price = item.product.price;

    // Validate số lượng mới
    this.validateInventoryAndLimit(item.product.status, stock, 0, 99, dto.quantity);

    item.quantity = dto.quantity;
    item.total_money = dto.quantity * price;
    return this.cartItemRepo.save(item);
  }

  async updateNote(userId: number, cartItemId: number, dto: UpdateCartItemNoteDto) {
    const item = await this.cartItemRepo.findOne({
      where: { cart_item_id: cartItemId, cart: { user: { user_id: userId } } }
    });
    if (!item) throw new NotFoundException('Item không tồn tại');
    
    item.note = dto.note;
    return this.cartItemRepo.save(item);
  }

  async removeItems(userId: number, dto: BulkDeleteCartItemsDto) {
    if (!dto.cartItemIds || dto.cartItemIds.length === 0) return;

    return this.cartItemRepo.createQueryBuilder()
      .delete()
      .where("cart_id IN (SELECT cart_id FROM carts WHERE user_id = :userId)", { userId })
      .andWhere("cart_item_id IN (:...ids)", { ids: dto.cartItemIds })
      .execute();
  }

  async clearCart(userId: number) {
    return this.cartItemRepo.createQueryBuilder()
      .delete()
      .where("cart_id IN (SELECT cart_id FROM carts WHERE user_id = :userId)", { userId })
      .execute();

    //   const cart = await this.cartRepo.findOne({
    //   where: { user: { user_id: userId } },
    //   select: ['cart_id'],
    // });

    // // Nếu user chưa từng có giỏ hàng, không cần làm gì thêm
    // if (!cart) return;

    // // Bước 2: Xóa toàn bộ CartItem thuộc về cart_id này
    // await this.cartItemRepo.delete({ 
    //   cart: { cart_id: cart.cart_id } 
    // });
  }

}