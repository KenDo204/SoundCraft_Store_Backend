import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { Product } from '@/products/entities/product.entity';
import { ProductVariant } from '@/products/entities/product-variant.entity';

@Entity('order_items')
export class OrderItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  order_item_id: number;

  @ApiProperty({ example: 1, description: 'Số lượng mua' })
  @Column({ type: 'int' })
  quantity: number;

  @ApiProperty({ example: 1200000.00, description: 'Giá tại thời điểm mua (để tránh bị đổi giá sau này)' })
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  price_at_purchase: number;

  @ApiProperty({ description: 'Lưu snapshot thông tin biến thể dưới dạng JSON', nullable: true })
  @Column({ type: 'jsonb', nullable: true })
  variant_info: any;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant, { nullable: true })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;
}