import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, ValidateNested, ArrayMinSize, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductImageDto } from './products.dto';
import { CreateProductVariantDto } from './products.dto';

export class CreateProductDto {
  @ApiProperty({ description: 'Mã sản phẩm (SKU)' })
  @IsString()
  @IsNotEmpty()
  productCode: string;

  @ApiProperty({ description: 'Tên nhạc cụ' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiPropertyOptional({ description: 'Mô tả chi tiết' })
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiPropertyOptional({ description: 'Đánh dấu là sản phẩm phổ biến' })
  @IsBoolean()
  @IsOptional()
  inPopular?: boolean;

  @ApiPropertyOptional({ description: 'ID Thương hiệu (Brand)' })
  @IsNumber()
  @IsOptional()
  brandId?: number;

  @ApiProperty({ type: [CreateProductImageDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductImageDto)
  images: CreateProductImageDto[];

  @ApiProperty({ type: [CreateProductVariantDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}