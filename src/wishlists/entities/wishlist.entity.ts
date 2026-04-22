import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Unique, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Product } from '@/products/entities/product.entity';

@Entity('wishlists')
@Unique(['user', 'product']) // UNIQUE (user_id, product_id)
export class Wishlist {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  wishlist_id: number;

  @ApiProperty({ type: Date })
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ApiProperty({ type: Date })
  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}