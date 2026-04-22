import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, In } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CheckoutRequestDto } from './dto/checkout-request.dto';
import { CartItem } from '../carts/entities/cart-item.entity';
import { AddressService } from '../addresses/addresses.service';
import { InventoryService } from '../inventory/inventory.service';
import { GhnService } from '../ghn/ghn.service';
import { Product } from '../products/entities/product.entity';
import { VnpayService } from '../vnpay/vnpay.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    private dataSource: DataSource,
    private addressService: AddressService,
    private inventoryService: InventoryService,
    private ghnService: GhnService,
    private vnpayService: VnpayService,
    private notificationsService: NotificationsService
  ) {}

  // 1. NGHIỆP VỤ CHECKOUT HỢP NHẤT
  async checkout(userId: number, dto: CheckoutRequestDto, ipAddress: string) {
    // Start Transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Fetch Address
      let address;
      try {
        address = await this.addressService.getAddressById(userId, dto.addressId);
      } catch (err) {
        throw new BadRequestException('Địa chỉ giao hàng không hợp lệ hoặc không thuộc về người dùng.');
      }

      // 2. Fetch selected Cart Items
      const cartItemIds = dto.selectedItems.map(item => item.id);
      const cartItems = await queryRunner.manager.find(CartItem, {
        where: { 
           cart_item_id: In(cartItemIds),
           cart: { user: { user_id: userId } }
        },
        relations: ['product']
      });

      if (cartItems.length !== dto.selectedItems.length) {
        throw new BadRequestException('Có sản phẩm trong giỏ hàng đã thay đổi hoặc không còn tồn tại.');
      }

      let subTotal = 0;
      let totalWeightGram = 0;

      // 3. Loop: Gộp bill, check tồn kho
      for (const item of cartItems) {
        const currentPrice = item.product.price;
        const isActive = item.product.stock_quantity > 0;
        
        if (!isActive) {
          throw new BadRequestException(`Sản phẩm ${item.product.product_name} đã hết hàng hoặc không khả dụng.`);
        }

        subTotal += Number(currentPrice) * item.quantity;
        // Entity Product hiện tại không có cột weight, nên ta tạm dùng mặc định 500g/sản phẩm
        totalWeightGram += 500 * item.quantity;
      }
      
      const stockItems = cartItems.map(item => ({
        productId: item.product.product_id,
        quantity: item.quantity
      }));
      await this.inventoryService.deductStock(stockItems);

      // 4. Mã giảm giá (Coupons)
      let discountAmount = dto.discountAmount || 0;

      const postDiscountBase = Math.max(subTotal - discountAmount, 0);

      // 5. Phí Ship & GHN
      let shippingFee = dto.shippingFee;
      if (shippingFee === undefined || shippingFee === null) {
        try {
          const feeResponse = await this.ghnService.calculateShippingFee({
             fromDistrictId: Number(process.env.GHN_SHOP_DISTRICT_ID) || 1452,
             toDistrictId: address.district_id,
             toWardCode: address.ward_code,
             weight: totalWeightGram,
             insuranceValue: postDiscountBase
          });
          shippingFee = feeResponse.totalFee || 0;
        } catch (e) {
          shippingFee = 35000;
        }
      }

      const totalAmount = postDiscountBase + shippingFee;

      // 6. Lưu trữ thông tin Order & OrderItem
      const orderCode = `ORD-${Date.now()}`;
      const newOrder = this.orderRepo.create({
        order_code: orderCode,
        shipping_name: address.recipient_name,
        shipping_phone: address.phone,
        shipping_address: address.full_address,
        user: { user_id: userId }, // Reference to User relation
        payment_method: dto.paymentMethod,
        payment_status: 'UNPAID', // Ban đầu lúc nào cũng Unpaid
        status: 'PENDING',
        tax_amount: 0,
        platform_fee: 0,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        settlement_amount: totalAmount, // Lợi nhuận gộp sau phí
        note: dto.orderNote || 'Ghi chú cho đơn hàng',
      });

      const savedOrder = await queryRunner.manager.save(newOrder);

      const orderItemsToSave = cartItems.map(cItem => {
        const selectedItem = dto.selectedItems.find(item => item.id === cItem.cart_item_id);
        
        return this.orderItemRepo.create({
          order: savedOrder,
          product: cItem.product,
          quantity: cItem.quantity,
          price_at_purchase: cItem.product.price,
          // note: selectedItem?.note // Nếu bảng order_items của bạn có lưu note, thì uncomment dòng này
        });
      });
      await queryRunner.manager.save(orderItemsToSave);

      // 7. Clear các item giỏ hàng này
      const idsToDelete = cartItems.map(i => i.cart_item_id);
      if (idsToDelete.length > 0) {
        await queryRunner.manager.delete(CartItem, idsToDelete);
      }

      await queryRunner.commitTransaction();

      // 7. Gửi thông báo đặt hàng thành công
      await this.notificationsService.sendOrderNotification(userId, savedOrder.order_code, 'PENDING');

      // 8. Nếu là VNPAY, gửi tín hiệu create payment URL (Bên ngoài Transaction)
      let paymentUrl: string | undefined = undefined;
      if (dto.paymentMethod === 'VNPAY') {
         paymentUrl = this.vnpayService.createPaymentUrl({
            amount: Number(totalAmount),
            trackingNumber: savedOrder.order_code,
            ipAddress: ipAddress
         });
      }

      return {
        orderId: savedOrder.order_id,
        orderCode: savedOrder.order_code,
        totalAmount: Number(savedOrder.total_amount),
        status: savedOrder.status,
        paymentUrl: paymentUrl
      };

    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  // 2. NGHIỆP VỤ HỦY ĐƠN HÀNG (CANCELLATION)
  async cancelOrderByBuyer(userId: number, orderId: number, reason: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(Order, { 
         where: { order_id: orderId, user: { user_id: userId } },
         relations: ['items', 'items.product']
      });

      if (!order) throw new NotFoundException('Không tìm thấy đơn hàng.');

      if (order.status !== 'PENDING') {
         throw new BadRequestException('Không thể hủy đơn hàng này khi đang giao hoặc đã trả tiền hoàn tất.');
      }

      order.status = 'CANCELLED';
      order.note = `Bị hủy bởi khách (Lý do: ${reason})`;
      await queryRunner.manager.save(Order, order);

      // Gửi thông báo hủy đơn thành công
      await this.notificationsService.sendOrderNotification(userId, order.order_code, 'CANCELLED_BY_USER');

      // Tự động Release các biến thể đã hold (giải phóng tồn kho)
      const stockItems = order.items.map(item => ({
        productId: item.product.product_id,
        quantity: item.quantity
      }));
      await this.inventoryService.releaseStock(stockItems);

      // Xử lí hoàn tiền tự động (Nếu lỡ khách đã thanh toán VNPAY trước nhưng chưa xử lý)
      if (order.payment_status === 'PAID') {
         await this.vnpayService.refund({
            orderId: order.order_code,
            transDate: order.created_at.toISOString().slice(0, 10).replace(/-/g, '') + '000000', // Mock transaction date
            amount: Number(order.total_amount),
            tranType: '02',
            user: 'admin',
            ipAddress: '127.0.0.1'
         });
      }

      // Hủy trên platform giao hàng GHN
      if(order.tracking_code) {
         // await this.ghnService.cancelOrder(order.tracking_code);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // 3. NGHIỆP VỤ XỬ LÝ VNPAY CALLBACK
  async handleVnpayCallback(query: any) {
     // Validate VNPAY Checksum Signature (Đọc code VNPAY trong services VNPay của bạn)
     const isValid = this.vnpayService.validateSignature(query);
     if (!isValid) return { RspCode: '97', Message: 'Invalid signature' };

     const orderCode = query.vnp_TxnRef;
     const paymentStatus = query.vnp_ResponseCode === '00' && query.vnp_TransactionStatus === '00';

     const order = await this.orderRepo.findOne({ where: { order_code: orderCode } });

     if (!order) return { RspCode: '01', Message: 'Order not found' };

     // Fix lặp lại - Idempotency
     if (order.payment_status === 'PAID') return { RspCode: '02', Message: 'Order already confirmed' };

     // Check matching amount (VD: 1000000 -> 100000000 VNĐ *100 bên VNPay)
     if (Number(order.total_amount) * 100 !== Number(query.vnp_Amount)) {
       return { RspCode: '04', Message: 'Invalid amount' };
     }

     if (paymentStatus) {
        order.payment_status = 'PAID';
        await this.orderRepo.save(order);
        return { RspCode: '00', Message: 'Confirm Success' };
     }

     return { RspCode: '00', Message: 'Payment not successful' };
  }

  // 4. LẤY DANH SÁCH ORDER CHO ADMIN
  async getAllOrdersAdmin() {
    const orders = await this.orderRepo.find({
      relations: ['user', 'items', 'items.product', 'items.product.images'],
      order: { created_at: 'DESC' }
    });
    return orders.map(order => this.mapToOrderResponse(order));
  }

  // 5. CẬP NHẬT STATUS ORDER CHO ADMIN
  async updateOrderStatus(orderId: number, status: string) {
    const order = await this.orderRepo.findOne({ where: { order_id: orderId }, relations: ['user'] });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    order.status = status;
    const updatedOrder = await this.orderRepo.save(order);

    // Gửi thông báo cập nhật trạng thái đơn hàng cho người dùng
    await this.notificationsService.sendOrderNotification(order.user.user_id, order.order_code, status);

    return updatedOrder;
  }

  // 6. CẬP NHẬT ITEMS ORDER CHO ADMIN (KHI KHÁCH YÊU CẦU THÊM/ĐỔI MÓN)
  async updateOrderItems(orderId: number, newItems: {productId: number, quantity: number}[]) {
    const order = await this.orderRepo.findOne({ where: { order_id: orderId }, relations: ['items'] });
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(OrderItem, { order: { order_id: orderId } });

      let newTotal = 0;
      const orderItemsToSave: OrderItem[] = [];
      
      for (const item of newItems) {
        const product = await queryRunner.manager.findOne(Product, { where: { product_id: item.productId } });
        if (!product) throw new BadRequestException('Không tìm thấy sản phẩm ' + item.productId);
        
        newTotal += Number(product.price) * item.quantity;
        orderItemsToSave.push(this.orderItemRepo.create({
          order: order,
          product: product,
          quantity: item.quantity,
          price_at_purchase: product.price
        }));
      }

      await queryRunner.manager.save(orderItemsToSave);

      order.total_amount = newTotal + Number(order.shipping_fee) - Number(order.discount_amount);
      await queryRunner.manager.save(order);

      await queryRunner.commitTransaction();
      return this.orderRepo.findOne({ where: { order_id: orderId } });
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  // 7. LẤY DANH SÁCH ORDER CHO CUSTOMER
  async getOrdersByCurrentUser(userId: number) {
    const orders = await this.orderRepo.find({
      where: { user: { user_id: userId } },
      relations: ['user', 'items', 'items.product', 'items.product.images'],
      order: { created_at: 'DESC' }
    });
    return orders.map(order => this.mapToOrderResponse(order));
  }

  // HELPER MAPPING
  private mapToOrderResponse(order: Order) {
    if(!order) return null;
    return {
      id: order.order_id,
      note: order.note || '',
      orderDate: order.created_at,
      status: order.status,
      totalMoney: Number(order.total_amount),
      shippingMethod: 'GHN', // Mock
      trackingNumber: order.tracking_code || '',
      paymentMethod: order.payment_method,
      active: order.status !== 'CANCELLED',
      userId: order.user?.user_id,
      address: {
        fullAddress: order.shipping_address
      },
      orderDetails: order.items?.map(item => {
        const thumbnailImg = item.product?.images?.find(img => img.is_thumbnail === true);
        return {
          productId: item.product?.product_id,
          productName: item.product?.product_name,
          quantity: item.quantity,
          price: Number(item.price_at_purchase),
          imageUrl: thumbnailImg ? thumbnailImg.image_url : (item.product?.images?.[0]?.image_url || null)
        };
      }) || []
    };
  }
}
