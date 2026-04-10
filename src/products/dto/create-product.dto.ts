import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateNested, ArrayMinSize, IsNumber, IsEnum, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CreateProductImageDto } from './products.dto';
import { CreateProductVariantDto } from './products.dto';

// ==========================================
// 3. DTO chính cho Sản phẩm (Main DTO)
// ==========================================
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}
export class CreateProductDto {
  @ApiProperty({ description: 'Tên sản phẩm' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional({ description: 'Đường dẫn SEO' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết' })
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiPropertyOptional({ enum: ProductStatus, default: ProductStatus.ACTIVE })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: string = ProductStatus.ACTIVE;

  @ApiPropertyOptional({ description: 'Giá gốc' })
  @Transform(({ value }) => Number(value)) // Tự động ép chuỗi '50000' thành số 50000
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Tồn kho gốc' })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  stockQuantity?: number;

  // 🌟 ĐÃ CHỈNH SỬA: Bắt buộc phải có ID của Thương hiệu
  @ApiProperty({ description: 'ID của Thương hiệu (Bắt buộc)' })
  @Transform(({ value }) => Number(value)) 
  @IsNumber()
  @IsNotEmpty({ message: 'Vui lòng cung cấp brandId' })
  brandId: number;

  // 🌟 FIX LỖI BOOLEAN: Tự động dịch chuỗi 'true' thành boolean true
  @ApiPropertyOptional({ description: 'Đánh dấu nổi bật' })
  @Transform(({ value }) => value === 'true' || value === true) 
  @IsBoolean()
  @IsOptional()
  inPopular?: boolean;

  // 🌟 FIX LỖI ARRAY: Nhận mảng Biến thể dưới dạng CHUỖI JSON
  @ApiPropertyOptional({ description: 'Chuỗi JSON chứa phân loại' })
  @IsString()
  @IsOptional()
  variants?: string;

  // 🌟 Nhận mảng Ảnh giữ lại (Khi update) dưới dạng CHUỖI JSON
  @ApiPropertyOptional({ description: 'Chuỗi JSON chứa mảng URL ảnh muốn giữ lại' })
  @IsString()
  @IsOptional()
  retainedImagesJson?: string;
}