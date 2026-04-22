import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressResponse {
  @ApiPropertyOptional()
  city?: string;
  @ApiPropertyOptional()
  district?: string;
  @ApiPropertyOptional()
  ward?: string;
  @ApiProperty()
  fullAddress: string;
}

export class OrderDetailResponse {
  @ApiProperty()
  productId: number;
  @ApiProperty()
  productName: string;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  price: number;
  @ApiPropertyOptional()
  imageUrl?: string;
}

export class OrderResponse {
    @ApiProperty()
    id: number;

    @ApiProperty()
    note: string;

    @ApiProperty()
    orderDate: Date;

    @ApiProperty()
    status: string;

    @ApiProperty()
    totalMoney: number;

    @ApiProperty()
    shippingMethod: string;

    @ApiProperty()
    trackingNumber: string;

    @ApiProperty()
    paymentMethod: string;

    @ApiProperty()
    active: boolean;

    @ApiPropertyOptional()
    paymentUrl?: string;

    @ApiProperty()
    userId: number;

    @ApiProperty()
    address: AddressResponse;

    @ApiProperty({ type: [OrderDetailResponse] })
    orderDetails: OrderDetailResponse[];
}
