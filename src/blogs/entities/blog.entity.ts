import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';

@Entity('blogs')
export class Blog {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  blog_id: number;

  @ApiProperty({ example: 'Cách chọn đàn Guitar cho người mới tập', description: 'Tiêu đề bài viết' })
  @Column({ length: 150 })
  title: string;

  @ApiProperty({ example: 'cach-chon-dan-guitar-cho-nguoi-moi', description: 'Slug đường dẫn duy nhất' })
  @Column({ length: 255, unique: true })
  slug: string;

  @ApiProperty({ example: 'Bài viết này sẽ hướng dẫn bạn...', description: 'Mô tả ngắn' })
  @Column({ length: 300, nullable: true })
  short_description: string;

  @ApiProperty({ example: '<p>Nội dung bài viết...</p>', description: 'Nội dung chi tiết (HTML/Markdown)' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ example: 'https://link-anh.com/blog1.jpg' })
  @Column({ length: 255, nullable: true })
  image: string;

  @ApiProperty({ example: 'PUBLISHED', description: 'Trạng thái: DRAFT, HIDDEN, PUBLISHED' })
  @Column({ length: 20, default: 'DRAFT' })
  status: string;

  @ApiProperty({ example: 1250, description: 'Lượt xem' })
  @Column({ type: 'bigint', default: 0 })
  view_count: number;

  @ApiProperty({ description: 'Ngày xuất bản công khai', nullable: true })
  @Column({ type: 'date', nullable: true })
  published_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'author_id' })
  author: User;
}