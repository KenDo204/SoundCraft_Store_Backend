import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, Min } from 'class-validator';
import { PaymentMethod } from '../enums/payment-method.enum';
import { OrderStatus } from '../enums/order-status.enum';

export class CreateOrderDto {
  @ApiProperty({ example: 1, description: 'ID của khách hàng' })
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty({ example: 1, description: 'ID của sản phẩm' })
  @IsNumber()
  @IsNotEmpty()
  product_id: number;

  @ApiProperty({ example: 1000000, description: 'Tổng tiền đơn hàng' })
  @IsNumber()
  @Min(0)
  total_amount: number;

  @ApiProperty({ example: 'Thanh toán khi nhận hàng', enum: PaymentMethod })
  @IsString()
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  payment_method: PaymentMethod;

  @ApiProperty({ example: 'PENDING', enum: OrderStatus, required: false })
  @IsString()
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @ApiProperty({ example: 'Giao hàng hỏa tốc', required: false })
  @IsString()
  @IsOptional()
  customer_note?: string;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsString()
  @IsOptional()
  delivery_date?: string;
}
