import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('coupons')
export class Coupon {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  coupon_id: number;

  @ApiProperty({ example: 'GUITAR2026', description: 'Mã code duy nhất' })
  @Column({ length: 50, unique: true })
  code: string;

  @ApiProperty({ example: 'PERCENT', description: 'PERCENT hoặc FIXED' })
  @Column({ length: 20 })
  discount_type: string;

  @ApiProperty({ example: 15.00, description: 'Giá trị giảm' })
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  discount_value: number;

  @ApiProperty({ example: 500000.00, description: 'Đơn hàng tối thiểu' })
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  min_order_amount: number;

  @ApiProperty({ example: 100, description: 'Số lượt dùng còn lại' })
  @Column({ type: 'int', default: 1000 })
  max_usage: number;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  start_date: Date;

  @ApiProperty()
  @Column({ type: 'timestamp' })
  end_date: Date;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;
}