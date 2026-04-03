import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '@/categories/entities/category.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { CartItem } from '@/carts/entities/cart-item.entity';

@Entity('products')
export class Product {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  product_id: number;

  @ApiProperty({ example: 'SP001', description: 'Mã sản phẩm' })
  @Column({ length: 100, unique: true, nullable: true })
  product_code: string;

  @ApiProperty({ example: 'Đàn Guitar Yamaha C40' })
  @Column({ length: 200, nullable: true })
  product_name: string;

  @ApiProperty({ example: 'Mô tả chi tiết về âm sắc và chất liệu gỗ...' })
  @Column({ type: 'text', nullable: true })
  product_description: string;

  @ApiProperty({ example: 'https://link-anh.com/sp1.jpg' })
  @Column({ length: 500, nullable: true })
  product_img: string;

  @ApiProperty({ example: false, description: 'Sản phẩm phổ biến' })
  @Column({ default: false })
  in_popular: boolean;

  @ApiProperty({ example: true, description: 'Còn hàng' })
  @Column({ default: true })
  is_stock: boolean;

  @ManyToOne(() => Category, (category) => category.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}