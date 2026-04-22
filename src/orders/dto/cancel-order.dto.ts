import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
export class CancelOrderDto {
  @ApiProperty({ description: 'Lý do hủy đơn', example: 'Thay đổi ý định mua' })
  @IsString()
  @IsNotEmpty({ message: 'Lý do hủy đơn là bắt buộc' })
  reason: string;
}