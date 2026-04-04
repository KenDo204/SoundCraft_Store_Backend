import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Guitar & Bass' })
  @IsString()
  @IsNotEmpty({ message: 'Tên danh mục không được để trống' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Khám phá bộ sưu tập...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  // Lấy ý tưởng từ BE 1: Nhận ID của danh mục cha
  @ApiProperty({ example: null, required: false, description: 'ID Danh mục cha (Bỏ trống nếu là danh mục gốc)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parent_id?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: false, description: 'Ảnh bìa danh mục (Thường dùng cho danh mục Level 1)' })
  @IsOptional()
  file?: any;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  is_active?: boolean;
}
