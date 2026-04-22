import { Controller, Get, Put, Param, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { PaginationQueryDto, PaginatedNotificationResponseDto } from './dto/notifications.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'; 
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách thông báo của tôi (Phân trang)' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thông báo thành công', type: PaginatedNotificationResponseDto })
  async getMyNotifications(@CurrentUserId() userId: number, @Query() query: PaginationQueryDto) {
    const data = await this.notificationsService.getMyNotifications(userId, query);
    
    return {
      status: 200,
      message: 'Lấy danh sách thông báo thành công',
      data,
    };
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Lấy số lượng thông báo chưa đọc' })
  async countUnread(@CurrentUserId() userId: number) {
    const count = await this.notificationsService.countUnreadNotifications(userId);
    
    return {
      status: 200,
      message: 'Lấy số lượng thông báo chưa đọc thành công',
      data: count,
    };
  }

  @Put('read-all')
  @ApiOperation({ summary: 'Đánh dấu tất cả thông báo là đã đọc' })
  async markAllAsRead(@CurrentUserId() userId: number) {
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
    @CurrentUserId() userId: number, 
    @Param('id', ParseIntPipe) notificationId: number
  ) {
    await this.notificationsService.markNotificationAsRead(notificationId, userId);
    
    return {
      status: 200,
      message: 'Đánh dấu đã đọc thành công',
    };
  }
}