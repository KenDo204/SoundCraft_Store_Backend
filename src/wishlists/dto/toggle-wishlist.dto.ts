import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ToggleWishlistDto {
  @ApiProperty({ example: 1, description: 'ID của sản phẩm muốn thêm/xóa khỏi wishlist' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;
}
