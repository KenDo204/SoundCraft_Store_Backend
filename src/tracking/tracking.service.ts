import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserBehavior } from './entities/user-behavior.entity';
import { TrackingBehaviorBatchDto, TrackingBehaviorItemDto } from './dto/tracking.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { UserActionType } from './enums/user-action.enum';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(
    @InjectRepository(UserBehavior) private behaviorRepo: Repository<UserBehavior>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  /**
   * Hàm xử lý bất đồng bộ. Controller gọi hàm này và không cần chờ kết quả.
   */
  async enqueueBatch(request: TrackingBehaviorBatchDto): Promise<void> {
    try {
      const items = request.behaviors;
      
      // 1. Tối ưu hóa truy vấn (Bulk Query): Lọc ra toàn bộ userId và productId cần check
      const userIds = [...new Set(items.map(i => i.userId).filter(Boolean))];
      const productIds = [...new Set(items.map(i => i.productId).filter(Boolean))];

      // Tìm trong DB một lần duy nhất
      const existingUsers = userIds.length > 0 ? await this.userRepo.find({ where: { user_id: In(userIds) }, select: ['user_id'] }) : [];
      const existingProducts = productIds.length > 0 ? await this.productRepo.find({ where: { product_id: In(productIds) }, select: ['product_id'] }) : [];

      const validUserIds = new Set(existingUsers.map(u => Number(u.user_id)));
      const validProductIds = new Set(existingProducts.map(p => Number(p.product_id)));

      // 2. Map và Validate từng item trên RAM
      const validBehaviors: UserBehavior[] = [];

      for (const item of items) {
        try {
          const behavior = this.mapValidatedBehavior(item, validUserIds, validProductIds);
          if (behavior) validBehaviors.push(behavior);
        } catch (error: any) {
          // Ghi nhận lỗi của 1 item, các item khác vẫn được chạy tiếp
          this.logger.warn(`Tracking Item Error: ${error.message}`);
        }
      }

      // 3. Insert cả mảng hợp lệ vào DB
      if (validBehaviors.length > 0) {
        await this.behaviorRepo.save(validBehaviors);
      }

    } catch (error: any) {
      this.logger.error(`Lỗi hệ thống khi xử lý Batch Tracking: ${error.message}`, error.stack);
    }
  }

  private mapValidatedBehavior(
    item: TrackingBehaviorItemDto,
    validUserIds: Set<number>,
    validProductIds: Set<number>
  ): UserBehavior | null {
    const sessionId = item.sessionId?.trim() || null;
    const userId = item.userId;

    // Rule 1: Phải có ít nhất định danh
    if (!userId && !sessionId) {
      throw new Error('Thiếu định danh: user_id và session_id đều null.');
    }

    // Rule 2: Nếu có userId, user đó phải tồn tại trong tập hợp hợp lệ
    if (userId && !validUserIds.has(Number(userId))) {
      throw new Error(`user_id [${userId}] không tồn tại trong hệ thống.`);
    }

    const behavior = new UserBehavior();
    behavior.action_type = item.actionType;
    behavior.session_id = sessionId;
    behavior.keyword = item.keyword?.trim() || null;
    behavior.context_data = item.contextData;
    behavior.user = userId ? { user_id: userId } as any : null;

    // Rule 3: Áp dụng validation ngữ cảnh theo ActionType (Dispatch Rule)
    switch (item.actionType) {
      case UserActionType.VIEW_PRODUCT:
      case UserActionType.ADD_TO_CART:
      case UserActionType.PURCHASE:
      case UserActionType.ADD_TO_WISHLIST:
        if (!item.productId) throw new Error(`Hành vi ${item.actionType} thiếu product_id.`);
        if (!validProductIds.has(Number(item.productId))) throw new Error(`product_id [${item.productId}] không tồn tại.`);
        behavior.product = { product_id: item.productId } as any;
        break;

      case UserActionType.SEARCH:
        if (!behavior.keyword) throw new Error('Hành vi SEARCH thiếu keyword.');
        break;
      
      default:
        throw new Error(`ActionType [${item.actionType}] không hợp lệ.`);
    }

    return behavior;
  }
}