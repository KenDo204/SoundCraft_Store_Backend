import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Address } from '@/addresses/entities/address.entity';
import { Notification } from '@/notifications/entities/notification.entity';
import { Cart } from '@/carts/entities/cart.entity';
import { UserRole } from '@/users/enums/user-role.enum';

@Entity('users')
export class User {
  @ApiProperty({ example: 1, description: 'ID người dùng' })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  user_id: number;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Họ và tên' })
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
  @Column({ type: 'varchar', length: 20, default: UserRole.CUSTOMER, })
  role: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => Address, (address) => address.user)
  addresses: Address[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @OneToOne(() => Cart, (cart) => cart.user)
  cart: Cart;
}