import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Product } from '@/products/entities/product.entity';
import { Category } from '@/categories/entities/category.entity';
import { UserActionType } from '@/tracking/enums/user-action.enum';

@Entity('user_behaviors')
@Index('idx_behavior_user', ['user'])
@Index('idx_behavior_product', ['product'])
@Index('idx_behavior_category', ['category'])
export class UserBehavior {
  @ApiProperty({ description: 'ID định danh log hành vi' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  behavior_id: number;

  @ApiProperty({ enum: UserActionType, description: 'Loại hành vi của người dùng' })
  @Column({ type: 'varchar', length: 50 })
  action_type: UserActionType;

  @ApiPropertyOptional({ description: 'Session ID dành cho khách chưa đăng nhập' })
  @Column({ type: 'varchar', length: 100, nullable: true })
  session_id: string | null;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (nếu action là SEARCH)' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  keyword: string | null;

  @ApiPropertyOptional({ description: 'Các dữ liệu ngữ cảnh khác (JSON)' })
  @Column({ type: 'jsonb', nullable: true })
  context_data: any;

  @ManyToOne(() => User, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Category, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ApiProperty({ description: 'Thời điểm ghi nhận hành vi' })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}