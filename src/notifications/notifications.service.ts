import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { PaginationQueryDto } from './dto/notifications.dto';
import { NotificationType } from './enums/notification-type.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  /**
   * Lấy danh sách thông báo có phân trang
   */
  async getMyNotifications(userId: number, query: PaginationQueryDto) {
    const { page = 0, size = 10 } = query;
    const skip = page * size;

    const [items, totalElements] = await this.notificationRepo.findAndCount({
      where: { user: { user_id: userId } as any },
      order: { created_at: 'DESC' },
      skip: skip,
      take: size,
    });

    const totalPages = Math.ceil(totalElements / size);

    return {
      items: items.map(item => ({
        id: Number(item.notification_id),
        title: item.title,
        content: item.message,
        type: item.type,
        is_read: item.is_read,
        created_at: item.created_at,
      })),
      page,
      size,
      totalElements,
      totalPages,
    };
  }

  /**
   * Đếm số thông báo chưa đọc
   */
  async countUnreadNotifications(userId: number): Promise<number> {
    return await this.notificationRepo.count({
      where: { 
        user: { user_id: userId } as any, 
        is_read: false 
      },
    });
  }

  /**
   * Đánh dấu 1 thông báo là đã đọc
   */
  async markNotificationAsRead(notificationId: number, userId: number): Promise<void> {
    const notification = await this.notificationRepo.findOne({
      where: { notification_id: notificationId },
      relations: ['user'], // Cần join bảng user để lấy id kiểm tra
    });

    if (!notification) {
      throw new NotFoundException(`Không tìm thấy thông báo ID: ${notificationId}`);
    }

    if (Number(notification.user.user_id) !== Number(userId)) {
      throw new ForbiddenException('Bạn không có quyền thao tác trên thông báo này');
    }

    if (!notification.is_read) {
      notification.is_read = true;
      await this.notificationRepo.save(notification);
    }
  }

  /**
   * Đánh dấu tất cả là đã đọc (Bulk Update - Tối ưu hiệu năng)
   */
  async markAllNotificationsAsRead(userId: number): Promise<number> {
    const result = await this.notificationRepo.update(
      { 
        user: { user_id: userId } as any, 
        is_read: false 
      },
      { is_read: true }
    );
    
    // result.affected trả về số lượng dòng đã được update thành công
    return result.affected || 0; 
  }

  /**
   * Tạo thông báo mới
   */
  async createNotification(userId: number, title: string, message: string, type: NotificationType): Promise<Notification> {
    const notification = this.notificationRepo.create({
      user: { user_id: userId } as any,
      title,
      message,
      type,
      is_read: false,
    });
    return await this.notificationRepo.save(notification);
  }

  /**
   * Nghiệp vụ gửi thông báo đơn hàng tự động
   */
  async sendOrderNotification(userId: number, orderCode: string, status: string) {
    let title = '';
    let message = '';

    switch (status) {
      case 'PENDING':
        title = 'Đặt hàng thành công';
        message = `Đơn hàng ${orderCode} của bạn đã được tiếp nhận và đang chờ xử lý.`;
        break;
      case 'PACKING':
      case 'PROCESSING':
        title = 'Đơn hàng đang xử lý';
        message = `Đơn hàng ${orderCode} của bạn đang được đóng gói.`;
        break;
      case 'SHIPPING':
        title = 'Đơn hàng đang vận chuyển';
        message = `Đơn hàng ${orderCode} đã được bàn giao cho đơn vị vận chuyển.`;
        break;
      case 'DELIVERED':
        title = 'Giao hàng thành công';
        message = `Đơn hàng ${orderCode} đã được giao thành công. Cảm ơn bạn đã mua hàng!`;
        break;
      case 'CANCELLED_BY_USER':
        title = 'Hủy đơn hàng thành công';
        message = `Bạn đã hủy thành công đơn hàng ${orderCode}.`;
        break;
      case 'CANCELLED':
        title = 'Đơn hàng đã hủy';
        message = `Đơn hàng ${orderCode} của bạn đã bị hủy.`;
        break;
      default:
        title = 'Cập nhật đơn hàng';
        message = `Đơn hàng ${orderCode} có cập nhật trạng thái mới: ${status}.`;
    }

    return await this.createNotification(userId, title, message, NotificationType.ORDER);
  }
}