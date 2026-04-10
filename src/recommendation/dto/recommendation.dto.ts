import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// DTO này được dùng chung để trả về danh sách sản phẩm dạng thẻ (Card) ngắn gọn
export class RecommendationResponseDto {
  @ApiProperty({ description: 'ID Sản phẩm' })
  productId: number;

  @ApiProperty({ description: 'Tên nhạc cụ' })
  productName: string;

  @ApiPropertyOptional({ description: 'URL Ảnh đại diện chính' })
  thumbnailUrl: string | null;

  @ApiProperty({ description: 'Giá thấp nhất từ các biến thể' })
  minPrice: number;

  @ApiProperty({ description: 'Cờ trạng thái còn hàng' })
  isStock: boolean;
}