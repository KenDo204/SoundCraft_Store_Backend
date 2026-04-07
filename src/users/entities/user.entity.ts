import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Address } from '@/addresses/entities/address.entity';
import { Notification } from '@/notifications/entities/notification.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { UserRole } from '@/users/enums/user-role.enum';
import { Gender } from '@/users/enums/user-roles.enum';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'ID người dùng' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  user_id: number;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên' })
  @Index()
  @Column({ length: 100, default: 'Khách hàng' })
  full_name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email duy nhất' })
  @Column({ length: 100, unique: true, nullable: true })
  email: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại' })
  @Column({ length: 15, unique: true, nullable: true })
  mobile: string;

  @Exclude() // Ẩn mật khẩu khi trả về JSON
  @Column({ length: 255, nullable: true, select: false })
  password: string;

  @ApiProperty({ description: 'Link ảnh đại diện' })
  @Column({ length: 500, nullable: true })
  avatar: string;

  @ApiProperty({ example: 'ROLE_CUSTOMER', description: 'Vai trò: ROLE_ADMIN, ROLE_SELLER, ROLE_CUSTOMER' })
  @Index()
  @Column({ type: 'varchar', length: 20, default: UserRole.CUSTOMER, })
  role: UserRole;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;
  
  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Lưu mã OTP quên mật khẩu (Nên để select: false để bảo mật)
  @Column({ type: 'varchar', length: 10, nullable: true, select: false })
  resetPasswordToken: string | null;

  // Thời gian mã OTP hết hạn
  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpires: Date | null;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}