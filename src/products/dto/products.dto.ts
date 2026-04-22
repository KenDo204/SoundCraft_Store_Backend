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

