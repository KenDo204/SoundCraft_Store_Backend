import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '@/users/entities/user.entity';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  token_id: number;

  @Column({ length: 500 })
  refresh_token: string;

  @Column({ default: false })
  revoked: boolean;

  @Column({ default: false })
  expired: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Thiết lập quan hệ với User và CASCADE DELETE như SQL
  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}