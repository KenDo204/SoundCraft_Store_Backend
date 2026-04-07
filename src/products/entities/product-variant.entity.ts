import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@/products/entities/product.entity';

@Entity('product_variants')
export class ProductVariant {
  @ApiProperty({ example: 1, description: 'ID biến thể' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  variant_id: number;

  @ApiProperty({ example: 'Size 4/4', description: 'Kích cỡ (Ví dụ: 4/4, 3/4 cho Violin/Guitar)', nullable: true })
  @Column({ length: 50, nullable: true })
  size_name: string;

  @ApiProperty({ example: 'Gỗ tự nhiên', description: 'Màu sắc hoặc kiểu vân gỗ', nullable: true })
  @Column({ length: 50, nullable: true })
  color_name: string;

  @ApiProperty({ example: 1500000.00, description: 'Giá riêng cho biến thể này' })
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  price: number;

  @ApiProperty({ example: 10, description: 'Số lượng tồn kho' })
  @Column({ type: 'int', default: 0 })
  stock_quantity: number;

  @ManyToOne(() => Product, (product) => product.variants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}