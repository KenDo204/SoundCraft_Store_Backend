import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../enums/notification-type.enum';

export class PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Trang hiện tại (bắt đầu từ 0)', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  page?: number = 0;

  @ApiPropertyOptional({ description: 'Số lượng item trên 1 trang', default: 10, maximum: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  size?: number = 10;
}

export class NotificationResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Đơn hàng đã được xác nhận' })
  title: string;

  @ApiProperty({ example: 'Đơn hàng #ORD123 của bạn đã được đóng gói và chuẩn bị giao.' })
  content: string;

  @ApiProperty({ enum: NotificationType, example: NotificationType.INFO })
  type: NotificationType;

  @ApiProperty({ example: false })
  is_read: boolean;

  @ApiProperty({ type: Date })
  created_at: Date;
}

export class PaginatedNotificationResponseDto {
  @ApiProperty({ type: [NotificationResponseDto] })
  items: NotificationResponseDto[];

  @ApiProperty({ example: 0 })
  page: number;

  @ApiProperty({ example: 10 })
  size: number;

  @ApiProperty({ example: 25 })
  totalElements: number;

  @ApiProperty({ example: 3 })
  totalPages: number;
}