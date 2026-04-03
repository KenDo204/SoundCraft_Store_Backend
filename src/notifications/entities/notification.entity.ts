import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';

@Entity('notifications')
export class Notification {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  notification_id: number;

  @ApiProperty({ example: 'Đơn hàng đã được xác nhận' })
  @Column({ length: 200 })
  title: string;

  @ApiProperty({ example: 'Đơn hàng #ORD123 của bạn đã được đóng gói và chuẩn bị giao.' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({ example: false })
  @Column({ default: false })
  is_read: boolean;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}