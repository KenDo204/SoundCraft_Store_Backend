import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber, Min } from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({ description: 'URL hình ảnh' })
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @ApiProperty({ description: 'Là ảnh đại diện chính' })
  @IsBoolean()
  isThumbnail: boolean;
}

export class CreateProductVariantDto {
  @ApiPropertyOptional({ description: 'Kích cỡ (VD: 4/4, 3/4)' })
  @IsString()
  @IsOptional()
  sizeName?: string;

  @ApiPropertyOptional({ description: 'Màu sắc/Chất liệu (VD: Gỗ hồng đào)' })
  @IsString()
  @IsOptional()
  colorName?: string;

  @ApiProperty({ description: 'Giá tiền' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Số lượng tồn kho' })
  @IsNumber()
  @Min(0)
  stockQuantity: number;
}

