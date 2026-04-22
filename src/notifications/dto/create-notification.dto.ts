import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { NotificationType } from '../enums/notification-type.enum';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID của người dùng nhận thông báo', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ description: 'Tiêu đề thông báo', example: 'Đơn hàng đã được xác nhận', maxLength: 200 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Nội dung chi tiết thông báo', example: 'Đơn hàng #ORD123 của bạn đã được đóng gói và chuẩn bị giao.' })
  @IsNotEmpty()
  @IsString()
  message: string;

  @ApiPropertyOptional({ 
    description: 'Loại thông báo', 
    enum: NotificationType, 
    default: NotificationType.INFO 
  })
  @IsOptional()
  @IsEnum(NotificationType)
  type?: NotificationType;
}
