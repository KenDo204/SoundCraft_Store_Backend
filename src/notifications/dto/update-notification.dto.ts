import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateNotificationDto } from './create-notification.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
  @ApiPropertyOptional({ description: 'Đánh dấu trạng thái đã đọc của thông báo', example: true })
  @IsOptional()
  @IsBoolean()
  is_read?: boolean;
}
