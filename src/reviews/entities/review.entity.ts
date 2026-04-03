import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Product } from '@/products/entities/product.entity';
import { Order } from '@/orders/entities/order.entity';
import { ReviewImage } from './review-image.entity';

@Entity('reviews')
@Unique(['user', 'product']) // Mỗi user chỉ đánh giá 1 sản phẩm 1 lần
export class Review {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  review_id: number;

  @ApiProperty({ example: 5, description: 'Đánh giá từ 1 đến 5 sao' })
  @Column({ type: 'int' })
  rating: number;

  @ApiProperty({ example: 'Đàn rất đẹp, âm thanh trong trẻo!', nullable: true })
  @Column({ type: 'text', nullable: true })
  comment: string;

  @ApiProperty({ example: 'PUBLISHED', description: 'PENDING, PUBLISHED, HIDDEN' })
  @Column({ length: 20, default: 'PENDING' })
  review_status: string;

  @ApiProperty({ description: 'Ngày shop phản hồi', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  reply_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Order, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @OneToMany(() => ReviewImage, (image) => image.review)
  images: ReviewImage[];
}