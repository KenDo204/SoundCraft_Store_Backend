import { Entity, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { Coupon } from './coupon.entity';
import { Order } from '@/orders/entities/order.entity';

@Entity('coupon_usages')
@Index('idx_coupon_usage_user', ['user', 'coupon'])
export class CouponUsage {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  usage_id: number;

  @ApiProperty()
  @CreateDateColumn()
  used_at: Date;

  @ManyToOne(() => User, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Coupon, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;
}