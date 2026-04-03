import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@/products/entities/product.entity';

@Entity('product_images')
export class ProductImage {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  image_id: number;

  @ApiProperty({ example: 'https://link-anh.com/guitar-1.jpg' })
  @Column({ length: 500 })
  image_url: string;

  @ApiProperty({ example: false, description: 'Ảnh đại diện chính của sản phẩm' })
  @Column({ default: false })
  is_thumbnail: boolean;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}