import { Controller, Get, Put, Param, Query, Req, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { PaginationQueryDto } from './dto/notifications.dto';

@ApiTags('Notifications')
@ApiBearerAuth()
// @UseGuards(JwtAuthGuard) // Bật Guard này lên để đảm bảo user đã đăng nhập
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của tôi (Phân trang)' })
  async getMyNotifications(@Req() req: any, @Query() query: PaginationQueryDto) {
    const userId = req.user.userId; // Thay đổi tùy theo cấu trúc JWT Payload của bạn
    const data = await this.notificationsService.getMyNotifications(userId, query);
    
    return {
      status: 200,
      message: 'Lấy danh sách thông báo thành công',
      data,
    };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Lấy số lượng thông báo chưa đọc' })
  async countUnread(@Req() req: any) {
    const userId = req.user.userId;
    const count = await this.notificationsService.countUnreadNotifications(userId);
    
    return {
      status: 200,
      message: 'Lấy số lượng thông báo chưa đọc thành công',
      data: count,
    };
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo là đã đọc' })
  async markAllAsRead(@Req() req: any) {
    const userId = req.user.userId;
    const updatedCount = await this.notificationsService.markAllNotificationsAsRead(userId);
    
    return {
      status: 200,
      message: 'Đánh dấu tất cả đã đọc thành công',
      data: updatedCount,
    };
  }

  @Put(':id/read')
  @ApiOperation({ summary: 'Đánh dấu 1 thông báo cụ thể là đã đọc' })
  async markAsRead(
    @Req() req: any, 
    @Param('id', ParseIntPipe) notificationId: number
  ) {
    const userId = req.user.userId;
    await this.notificationsService.markNotificationAsRead(notificationId, userId);
    
    return {
      status: 200,
      message: 'Đánh dấu đã đọc thành công',
    };
  }
}