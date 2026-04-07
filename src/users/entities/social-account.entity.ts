import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Unique, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';

@Entity('social_accounts')
@Unique(['provider', 'provider_id']) 
@Index(['provider', 'provider_id'])
export class SocialAccount {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  social_id: number;

  @ApiProperty({ example: 'GOOGLE', description: 'Nhà cung cấp: GOOGLE, FACEBOOK' })
  @Column({ length: 20 })
  provider: string;

  @ApiProperty({ example: '1029384756...', description: 'ID định danh từ Google/FB' })
  @Column({ length: 255 })
  provider_id: string;

  @ApiProperty({ example: 'user@gmail.com', nullable: true })
  @Column({ length: 255, nullable: true })
  email: string;

  @ApiProperty({ example: 'Nguyễn Văn A', nullable: true })
  @Column({ length: 255, nullable: true })
  name: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  @Index()
  user: User;
}