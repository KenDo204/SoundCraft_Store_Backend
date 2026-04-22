import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePreOrderDto {
  @ApiProperty({ description: 'ID của sản phẩm cần nhận thông báo' })
  @IsNotEmpty()
  @IsNumber()
  product_id: number;

  @ApiPropertyOptional({ description: 'Ghi chú của khách hàng' })
  @IsOptional()
  @IsString()
  customer_note?: string;
}
