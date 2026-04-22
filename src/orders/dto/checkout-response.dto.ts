import { ApiProperty } from '@nestjs/swagger';
export class CheckoutResponseDto {
  @ApiProperty()
  orderId: number;
  @ApiProperty()
  orderCode: string;
  @ApiProperty()
  totalAmount: number;
  @ApiProperty()
  status: string;
  @ApiProperty({ description: 'Link thanh toán VNPAY nếu paymentMethod = VNPAY', required: false })
  paymentUrl?: string;
}
