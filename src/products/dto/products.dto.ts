import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// ==========================================
// 1. DTO cho Hình ảnh (Sub-DTO)
// ==========================================
export class CreateProductImageDto {
  @ApiProperty({ description: 'URL hình ảnh' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'Là ảnh đại diện chính (Chỉ được phép 1 ảnh là true)' })
  @IsBoolean()
  isThumbnail: boolean;
}

// ==========================================
// 2. DTO cho Biến thể (Sub-DTO)
// ==========================================
export class CreateProductVariantDto {
  @ApiPropertyOptional({ description: 'Kích cỡ (VD: 4/4, 3/4)' })
  @IsString()
  @IsOptional()
  sizeName?: string;

  @ApiPropertyOptional({ description: 'Màu sắc/Chất liệu (VD: Gỗ hồng đào)' })
  @IsString()
  @IsOptional()
  colorName?: string;

  @ApiProperty({ description: 'Giá tiền của biến thể này' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Số lượng tồn kho của biến thể này' })
  @IsNumber()
  @Min(0)
  stockQuantity: number;
}
