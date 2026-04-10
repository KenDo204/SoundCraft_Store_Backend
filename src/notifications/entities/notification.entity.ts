import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';
import { NotificationType } from '../enums/notification-type.enum';

@Entity('notifications')
@Index('idx_notification_user_unread', ['user', 'is_read'])
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

  @ApiProperty({ enum: NotificationType, default: NotificationType.INFO })
  @Column({ type: 'varchar', length: 50, default: NotificationType.INFO })
  type: NotificationType;

  @ApiProperty({ example: false })
  @Column({ default: false })
  is_read: boolean;

  @ApiProperty()
  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}