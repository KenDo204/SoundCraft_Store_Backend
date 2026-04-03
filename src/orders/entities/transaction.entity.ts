import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';

@Entity('transactions')
export class Transaction {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  transaction_id: number;

  @ApiProperty({ example: 2500000.00 })
  @Column({ type: 'numeric', precision: 15, scale: 2 })
  amount: number;

  @ApiProperty({ example: 'PAYMENT', description: 'PAYMENT, REFUND' })
  @Column({ length: 20 })
  type: string;

  @ApiProperty({ example: 'Thanh toán qua VNPAY cho đơn hàng ORD123' })
  @Column({ length: 255, nullable: true })
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Order, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order: Order;
}