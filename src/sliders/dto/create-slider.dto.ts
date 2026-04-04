import { IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateSliderDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'File ảnh Banner' })
  @IsOptional() // Đặt optional để Multer tự check, tránh lỗi validation của class-validator
  file?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sub_title?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  target_url?: string;

  @ApiProperty({ required: false, description: 'ID của thương hiệu (chọn từ danh sách)' })
  @IsOptional()
  brand_id?: number;

  @ApiProperty({ default: true, required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsBoolean()
  is_active?: boolean;
}