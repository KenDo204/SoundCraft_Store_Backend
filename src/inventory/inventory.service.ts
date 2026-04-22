import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Product } from '../products/entities/product.entity';
@Injectable()
export class InventoryService {
  constructor(
    // Các biến (Dependencies) cần thiết cho Inventory
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly dataSource: DataSource, // Bắt buộc phải có để chạy Transaction khi trừ kho
  ) {}

  /**
   * 1. Kiểm tra tồn kho của một danh sách item (Dùng trước khi vào trang Checkout)
   */
  async checkStockAvailable(items: { productId: number; variantId?: number; quantity: number }[]): Promise<boolean> {
    for (const item of items) {
      let stock = 0;
      let status = 'INACTIVE';

      const product = await this.productRepo.findOne({ where: { product_id: item.productId } });
      if (!product) throw new NotFoundException(`Không tìm thấy sản phẩm ${item.productId}`);
      stock = product.stock_quantity;
      status = product.status;

      if (status !== 'ACTIVE') {
        throw new BadRequestException('Có sản phẩm trong đơn hàng đang tạm ngưng bán');
      }

      // stock = -1 nghĩa là vô hạn (hàng pre-order hoặc digital)
      if (stock !== -1 && stock < item.quantity) {
        throw new BadRequestException('Số lượng sản phẩm trong kho không đủ');
      }
    }

    return true;
  }

  /**
   * 2. Trừ kho thực sự (Deduct Stock) - Dùng khi đơn hàng đặt thành công
   * LƯU Ý: Phải chạy trong Transaction để tránh việc trừ kho bị lỗi giữa chừng
   */
  async deductStock(items: { productId: number; variantId?: number; quantity: number }[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (const item of items) {
        const product = await manager.findOne(Product, { where: { product_id: item.productId } });
        if (!product) throw new NotFoundException(`Sản phẩm ${item.productId} không tồn tại`);
        
        if (product.stock_quantity !== -1) {
          if (product.stock_quantity < item.quantity) throw new BadRequestException('Tồn kho sản phẩm không đủ');
          product.stock_quantity -= item.quantity;
          await manager.save(product);
        }
      }
    });
  }

  /**
   * 3. Hoàn lại kho (Release/Restock) - Dùng khi đơn hàng bị HỦY
   */
  async releaseStock(items: { productId: number; variantId?: number; quantity: number }[]): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      for (const item of items) {
        const product = await manager.findOne(Product, { where: { product_id: item.productId } });
        if (product && product.stock_quantity !== -1) {
          product.stock_quantity += item.quantity;
          await manager.save(product);
        }
      }
    });
  }
}