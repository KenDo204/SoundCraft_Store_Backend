import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class UpsertCartItemDto {
  @ApiProperty({ example: 1, description: 'ID của Sản phẩm gốc' })
  @IsNumber()
  productId: number;


  @ApiProperty({ example: 1, description: 'Số lượng muốn thêm/cập nhật' })
  @IsInt()
  @Min(1, { message: 'Số lượng phải lớn hơn hoặc bằng 1' })
  quantity: number;

  @ApiPropertyOptional({ example: 'Vui lòng lên dây chuẩn E standard giúp mình' })
  @IsOptional()
  @IsString()
  note?: string;
}

export class UpdateCartItemNoteDto {
  @ApiProperty({ example: 'Gói quà sinh nhật giúp mình nhé' })
  @IsString()
  note: string;
}

export class UpdateCartItemQuantityDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  quantity: number;
}

export class BulkDeleteCartItemsDto {
  @ApiProperty({ example: [1, 2, 5], description: 'Danh sách ID của các item muốn xóa' })
  @IsArray()
  @IsNumber({}, { each: true })
  cartItemIds: number[];
}

export class CartItemResponseDto {
  @ApiProperty({ example: 1 })
  cart_item_id: number;

  @ApiProperty({ example: 2 })
  quantity: number;

  @ApiPropertyOptional({ example: 'https://link-anh.com/guitar.jpg', description: 'Ảnh Thumbnail' })
  imageUrl?: string;

  @ApiProperty({ example: 3000000.00 })
  total_money: number;

  @ApiProperty({ example: true, description: 'Sản phẩm có thể mua được không?' })
  isAvailable: boolean;

  @ApiPropertyOptional({ example: 'Hết hàng', description: 'Lý do vô hiệu hóa (nếu isAvailable = false)' })
  disableReason?: string;

  @ApiProperty({ example: 3000000.00, description: 'Giá của sản phẩm tại thời điểm hiện tại' })
  currentPrice: number;

  @ApiProperty({ example: 5, description: 'Số lượng tối đa FE cho phép bấm dấu cộng (+)' })
  maxAllowedQuantity: number;

}

export class CartResponseDto {
  @ApiProperty({ example: 1 })
  cart_id: number;

  @ApiProperty({ type: [CartItemResponseDto] })
  items: CartItemResponseDto[];

  @ApiProperty({ example: 6000000.00 })
  totalCartMoney: number;
}
