import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '@/brands/entities/brand.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductImage } from './product-image.entity';
import { CartItem } from '@/carts/entities/cart-item.entity';

@Entity('products')
export class Product {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  product_id: number;

  @ApiProperty({ example: 'Đàn Guitar Yamaha C40' })
  @Column({ length: 200, nullable: true })
  product_name: string;

  @ApiProperty({ example: 'dan-guitar-yamaha-c40', description: 'Đường dẫn URL thân thiện (SEO)' })
  @Column({ length: 255, unique: true, nullable: true })
  slug: string;

  @ApiProperty({ example: 'Mô tả chi tiết về âm sắc và chất liệu gỗ...' })
  @Column({ type: 'text', nullable: true })
  product_description: string;

  @ApiProperty({ example: false, description: 'Sản phẩm phổ biến' })
  @Column({ default: false })
  in_popular: boolean;

  @ApiProperty({ example: true, description: 'Còn hàng' })
  @Column({ default: true })
  is_stock: boolean;

  // Thêm cột status theo đúng DB
  @ApiProperty({ example: 'ACTIVE', description: 'Trạng thái kinh doanh (ACTIVE/INACTIVE)' })
  @Column({ length: 20, default: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1500000.00, description: 'Giá cho sản phẩm' })
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ example: 10, description: 'Số lượng tồn kho' })
  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @ManyToOne(() => Brand, (brand) => brand.products, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => ProductVariant, (variant) => variant.product)
  variants: ProductVariant[];

  @OneToMany(() => ProductImage, (image) => image.product)
  images: ProductImage[];

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  cartItems: CartItem[];
}