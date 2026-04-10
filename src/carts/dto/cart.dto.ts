import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsString, IsArray, IsNumber } from 'class-validator';

export class UpsertCartItemDto {
  @ApiProperty({ example: 1, description: 'ID của Sản phẩm gốc' })
  @IsNumber()
  productId: number;

  @ApiPropertyOptional({ example: 10, description: 'ID của Biến thể (VD: Màu sắc, Loại gỗ)' })
  @IsOptional()
  @IsNumber()
  variantId?: number;

  @ApiPropertyOptional({ example: 'Size 4/4', description: 'Kích cỡ (VD: Dành cho Violin)' })
  @IsOptional()
  @IsString()
  productSize?: string;

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