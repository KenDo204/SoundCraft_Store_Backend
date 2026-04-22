import { IsString, IsNotEmpty, IsOptional, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export class CreateBlogDto {
  @ApiProperty({ example: 'Cách chọn đàn Guitar cho người mới tập', description: 'Tiêu đề bài viết' })
  @IsString()
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MaxLength(150, { message: 'Tiêu đề không được vượt quá 150 ký tự' })
  title: string;

  @ApiPropertyOptional({ example: 'Bài viết này sẽ hướng dẫn bạn...', description: 'Mô tả ngắn gọn' })
  @IsString()
  @IsOptional()
  @MaxLength(300, { message: 'Mô tả ngắn không được vượt quá 300 ký tự' })
  short_description?: string;

  @ApiProperty({ example: '<p>Nội dung chi tiết...</p>', description: 'Nội dung bài viết (HTML/Markdown)' })
  @IsString()
  @IsNotEmpty({ message: 'Nội dung bài viết không được để trống' })
  content: string;

  @ApiProperty({ 
    type: 'string', 
    format: 'binary', 
    required: false, 
    description: 'File ảnh bìa bài viết (upload trực tiếp)' 
  })
  @IsOptional()
  file?: any;
}