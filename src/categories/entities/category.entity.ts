import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('categories')
export class Category {
  @ApiProperty({ example: 1, description: 'ID của danh mục' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  category_id: number;

  @ApiProperty({ example: 'Guitar & Bass', description: 'Tên danh mục hiển thị trên Menu' })
  @Index()
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 'guitar-bass', description: 'Đường dẫn thân thiện (phục vụ SEO)' })
  @Column({ length: 120, unique: true })
  slug: string;

  @ApiProperty({ 
    example: 'Khám phá bộ sưu tập guitar luôn đổi mới của chúng tôi như guitar electric...', 
    nullable: true,
    description: 'Mô tả chi tiết hiển thị ở Banner danh mục'
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({ 
    example: 'https://res.cloudinary.com/.../guitar-bass-banner.jpg', 
    nullable: true,
    description: 'Ảnh nền Banner khi bấm vào danh mục'
  })
  @ApiProperty({
    example: null,
    nullable: true,
    description: 'JSON string of retained image URLs'
  })
  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  image_url: string | null;

  @ApiProperty({ example: 1, description: 'Cấp độ danh mục (1: Gốc, 2: Con, 3: Cháu)' })
  @Column({ type: 'int', default: 1 })
  level: number;

  @ApiProperty({ example: true, default: true })
  @Index()
  @Column({ default: true })
  is_active: boolean;

  // ==========================================
  // RELATION: CHA - CON (Self-referencing)
  // ==========================================
  @ApiProperty({ 
    example: null, 
    nullable: true, 
    description: 'ID của danh mục cha (Nếu là danh mục lớn nhất Level 1 thì để null)' 
  })
  @Index()
  @Column({ type: 'bigint', nullable: true })
  parent_id: number | null;

  @ManyToOne(() => Category, category => category.children, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  // ==========================================

  @ApiProperty({ type: Date })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn()
  updated_at: Date;
}