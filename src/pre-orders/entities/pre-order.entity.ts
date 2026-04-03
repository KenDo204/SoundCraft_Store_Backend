import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Product } from '@/products/entities/product.entity';

@Entity('pre_orders')
@Unique(['user', 'product', 'status']) // UNIQUE (user_id, product_id, status)
export class PreOrder {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  pre_order_id: number;

  @ApiProperty({ example: 'PENDING', description: 'Trạng thái: PENDING, NOTIFIED, CANCELLED' })
  @Column({ length: 20, default: 'PENDING' })
  status: string;

  @ApiProperty({ example: 'Lưu ý giao vào giờ hành chính', nullable: true })
  @Column({ length: 255, nullable: true })
  customer_note: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({ description: 'Ngày gửi thông báo cho khách hàng', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  notified_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}