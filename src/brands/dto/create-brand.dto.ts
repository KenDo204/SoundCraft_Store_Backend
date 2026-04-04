import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateBrandDto {
  @ApiProperty({ example: 'YAMAHA' })
  @IsString()
  @IsNotEmpty({ message: 'Mã thương hiệu không được để trống' })
  @MaxLength(50)
  @Matches(/^[A-Z0-9_]+$/, { message: 'Mã thương hiệu chỉ được chứa chữ hoa, số và gạch dưới' })
  brand_code: string;

  @ApiProperty({ example: 'Yamaha' })
  @IsString()
  @IsNotEmpty({ message: 'Tên thương hiệu không được để trống' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    required: false, 
    description: 'File ảnh logo thương hiệu (chỉ nhận file ảnh)' 
  })
  @IsOptional()
  file?: any;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ default: true, required: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true || value === 1 || value === '1')
  @IsOptional()
  is_active?: boolean;
}