import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';

@Entity('tokens')
export class Token {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  token_id: number;

  @ApiProperty({ description: 'Chuỗi Refresh Token' })
  @Column({ length: 500 })
  refresh_token: string;

  @ApiProperty({ example: false, description: 'Đã bị thu hồi/vô hiệu hóa chưa' })
  @Column({ default: false })
  revoked: boolean;

  @ApiProperty({ example: false, description: 'Đã hết hạn chưa' })
  @Column({ default: false })
  expired: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;
}