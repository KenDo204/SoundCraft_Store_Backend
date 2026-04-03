import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { Notification } from './entities/notification.entity'; // Import Entity của bạn

@Module({
  imports: [
    // Đăng ký Entity Notification để TypeORM tạo Repository
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  
  // Export để các module khác (như UsersModule) có thể dùng chung nếu cần
  exports: [NotificationsService], 
})
export class NotificationsModule {}