import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('user_recommendations')
export class UserRecommendation {
  @ApiProperty({ description: 'ID của Người dùng' })
  @PrimaryColumn({ type: 'bigint' })
  user_id: number;

  @ApiProperty({ description: 'ID của Sản phẩm được gợi ý' })
  @PrimaryColumn({ type: 'bigint' })
  product_id: number;

  @ApiProperty({ description: 'Điểm số độ phù hợp dựa trên thuật toán Collaborative Filtering' })
  @Column({ type: 'double precision', nullable: true })
  score: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({ description: 'Thời điểm bản ghi gợi ý được tạo' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}