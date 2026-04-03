import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { OrderItem } from './order-item.entity';
import { Transaction } from './transaction.entity';

@Entity('orders')
export class Order {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  order_id: number;

  @ApiProperty({ example: 'ORD-1712145001', description: 'Mã đơn hàng hiển thị cho khách' })
  @Column({ length: 50, unique: true })
  order_code: string;

  @ApiProperty({ example: 'Lê Văn B' })
  @Column({ length: 100 })
  shipping_name: string;

  @ApiProperty({ example: '0901234567' })
  @Column({ length: 15 })
  shipping_phone: string;

  @ApiProperty({ example: '456 Đường XYZ, Quận 1, TP.HCM' })
  @Column({ length: 500 })
  shipping_address: string;

  @ApiProperty({ example: 1, description: 'ID dịch vụ GHN' })
  @Column({ type: 'int', nullable: true })
  ghn_service_type_id: number;

  @ApiProperty({ example: 1, description: '1: Thanh toán khi nhận hàng, 2: Chuyển khoản' })
  @Column({ type: 'smallint', default: 1 })
  payment_type_id: number;

  @ApiProperty({ example: 'Giao sau giờ hành chính', nullable: true })
  @Column({ length: 255, nullable: true })
  note: string;

  @ApiProperty({ example: 35000.00 })
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  shipping_fee: number;

  @ApiProperty({ example: 50000.00 })
  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0 })
  discount_amount: number;

  @ApiProperty({ example: 2500000.00, description: 'Tổng tiền khách phải trả' })
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  total_amount: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0.00 })
  platform_fee: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0.00 })
  tax_amount: number;

  @Column({ type: 'numeric', precision: 15, scale: 2, default: 0.00 })
  settlement_amount: number;

  @ApiProperty({ example: 'SHIPPING', description: 'PENDING, SHIPPING, DELIVERED, CANCELLED' })
  @Column({ length: 20, default: 'PENDING' })
  status: string;

  @ApiProperty({ example: 'VNPAY' })
  @Column({ length: 20, default: 'COD' })
  payment_method: string;

  @ApiProperty({ example: 'PAID' })
  @Column({ length: 20, default: 'UNPAID' })
  payment_status: string;

  @ApiProperty({ example: 'GHN123456789', nullable: true })
  @Column({ length: 50, nullable: true })
  tracking_code: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.user_id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];

    @OneToMany(() => Transaction, (transaction) => transaction.order)
    transactions: Transaction[];
}