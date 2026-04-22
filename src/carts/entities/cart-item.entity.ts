import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Cart } from './cart.entity';
import { Product } from '@/products/entities/product.entity';
@Entity('cart_items')
export class CartItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  cart_item_id: number;

  @ApiProperty({ example: 2, description: 'Số lượng sản phẩm' })
  @Column({ type: 'int', default: 1 })
  quantity: number;

  @ApiProperty({ example: 3000000.00, description: 'Thành tiền cho item này' })
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  total_money: number;

  @ApiProperty({ example: 'Gói quà giúp mình nhé', nullable: true })
  @Column({ length: 200, nullable: true })
  note: string;

  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @ManyToOne(() => Product, (product) => product.cartItems)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}