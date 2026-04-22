import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePreOrderDto } from './create-pre-order.dto';
import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdatePreOrderDto extends PartialType(CreatePreOrderDto) {
  @ApiPropertyOptional({ description: 'Trạng thái: PENDING, NOTIFIED, CANCELLED' })
  @IsOptional()
  @IsString()
  status?: string;
}
