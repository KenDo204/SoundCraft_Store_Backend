import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

  @ApiProperty({ example: 'https://link-anh.com/banner.jpg' })
  @Column({ length: 500 })
  image_url: string;

  @ApiProperty({ nullable: true })
  @Column({ length: 500, nullable: true })
  brand_image: string;

  @ApiProperty({ example: '/products/guitar-classic' })
  @Column({ length: 500, nullable: true })
  target_url: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;
}