import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

// --- 1. DTO cho thông tin Tác giả (Tránh trả về password hay thông tin nhạy cảm của User) ---
export class BlogAuthorResponseDto {
  @ApiProperty({ example: 1 })
  @Expose()
  user_id: number;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @Expose()
  full_name: string; // Tùy thuộc vào Entity User của bạn có trường nào
  
  @ApiProperty({ example: 'https://link-avatar.com/ava.jpg' })
  @Expose()
  avatar: string;
}

// --- 2. DTO cho User (Giao diện hiển thị public) ---
// Chỉ hiển thị các bài PUBLISHED, giấu đi các trường như status hay ngày tạo/cập nhật nội bộ
export class BlogResponseUserDto {
  @ApiProperty({ example: 1 })
  @Expose()
  blog_id: number;

  @ApiProperty({ example: 'Cách chọn đàn Guitar cho người mới tập' })
  @Expose()
  title: string;

  @ApiProperty({ example: 'cach-chon-dan-guitar' })
  @Expose()
  slug: string;

  @ApiProperty({ example: 'Bài viết này sẽ hướng dẫn bạn...' })
  @Expose()
  short_description: string;

  @ApiProperty({ example: '<p>Nội dung...</p>' })
  @Expose()
  content: string;

  @ApiProperty({ example: 'https://link-anh.com/blog1.jpg' })
  @Expose()
  image: string;

  @ApiProperty({ example: 1250 })
  @Expose()
  view_count: number;

  @ApiProperty({ example: '2024-05-10T10:00:00.000Z' })
  @Expose()
  published_at: Date;

  @ApiProperty({ type: BlogAuthorResponseDto })
  @Expose()
  @Type(() => BlogAuthorResponseDto)
  author: BlogAuthorResponseDto;
}

// --- 3. DTO cho Admin (Giao diện quản lý) ---
// Trả về toàn bộ trạng thái, thời gian tạo/sửa để admin kiểm soát
export class BlogResponseAdminDto extends BlogResponseUserDto {
  @ApiProperty({ example: 'DRAFT' })
  @Expose()
  status: string;

  @ApiProperty({ example: '2024-05-09T10:00:00.000Z' })
  @Expose()
  created_at: Date;

  @ApiProperty({ example: '2024-05-10T10:00:00.000Z' })
  @Expose()
  updated_at: Date;
}