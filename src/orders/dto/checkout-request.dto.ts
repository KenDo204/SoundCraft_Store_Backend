import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class SelectedItemDto {
  @ApiProperty({ example: 91 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 'M', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: 189000, required: false })
  @IsNumber()
  @IsOptional()
  totalMoney?: number;

  @ApiProperty({ example: 'Ít đá', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
export class CheckoutRequestDto {
  @ApiProperty({ type: [SelectedItemDto], description: 'Danh sách các Item trong Giỏ hàng khách muốn thanh toán' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedItemDto)
  @ArrayMinSize(1, { message: 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.' })
  selectedItems: SelectedItemDto[];

  @ApiProperty({ description: 'ID của địa chỉ giao hàng', example: 10 })
  @IsNumber()
  @IsNotEmpty({ message: 'Vui lòng chọn địa chỉ giao hàng.' })
  addressId: number;

  @ApiProperty({ description: 'Phương thức thanh toán', example: 'COD', enum: ['COD', 'VNPAY'] })
  @IsString()
  @IsEnum(['COD', 'VNPAY'])
  paymentMethod: string;

  @ApiProperty({ description: 'Mã giảm giá', required: false, example: 'DISCOUNT20' })
  @IsString()
  @IsOptional()
  couponCode?: string;

  @ApiProperty({ description: 'Ghi chú cho đơn hàng', required: false, example: 'Giao trong giờ hành chính' })
  @IsString()
  @IsOptional()
  orderNote?: string;

  @ApiProperty({ description: 'Tổng tiền FE tính toán (BE sẽ kiểm tra lại)', required: false, example: 1500000 })
  @IsNumber()
  @IsOptional()
  totalAmount?: number;

  @ApiProperty({ description: 'Phí vận chuyển', required: false, example: 30000 })
  @IsNumber()
  @IsOptional()
  shippingFee?: number;

  @ApiProperty({ description: 'Số tiền giảm giá', required: false, example: 10000 })
  @IsNumber()
  @IsOptional()
  discountAmount?: number;
}