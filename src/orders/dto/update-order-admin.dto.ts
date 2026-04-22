import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsArray, IsNumber } from 'class-validator';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Trạng thái mới', enum: ['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'] })
  @IsString()
  @IsEnum(['PENDING', 'SHIPPING', 'DELIVERED', 'CANCELLED'])
  status: string;
}

export class OrderItemInputDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiProperty()
  @IsNumber()
  quantity: number;
}

export class UpdateOrderItemsDto {
  @ApiProperty({ type: [OrderItemInputDto] })
  @IsArray()
  items: OrderItemInputDto[];
}
