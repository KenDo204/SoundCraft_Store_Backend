import { ApiProperty } from '@nestjs/swagger';

export class WishlistStatusResponseDto {
  @ApiProperty({ example: 'Đã thêm vào danh sách yêu thích' })
  message: string;

  @ApiProperty({ example: true, description: 'Trạng thái hiện tại của sản phẩm trong wishlist' })
  isInWishlist: boolean;

  @ApiProperty({ example: 1 })
  productId: number;
}
