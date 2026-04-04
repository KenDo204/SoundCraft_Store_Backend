import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from 'src/brands/entities/brand.entity';

@Entity('sliders')
export class Slider {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  slider_id: number;

  @ApiProperty({ example: 'Giảm giá 20%', nullable: true })
  @Column({ length: 255, nullable: true })
  title: string;

  @ApiProperty({ example: 'Áp dụng cho dòng Guitar Classic', nullable: true })
  @Column({ length: 255, nullable: true })
  sub_title: string;

  @ApiProperty({ example: 'https://res.cloudinary.com/.../banner.jpg' })
  @Column({ length: 500 })
  image_url: string;

  @ApiProperty({ example: '/products/guitar-classic' })
  @Column({ length: 500, nullable: true })
  target_url: string;

  @ApiProperty({ example: 3, description: 'ID của thương hiệu (để lấy logo)' })
  @Column({ type: 'bigint', nullable: true })
  brand_id: number;

  @ManyToOne(() => Brand)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}