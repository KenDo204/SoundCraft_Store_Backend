import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';

@Entity('addresses')
@Index('idx_address_user_id', ['user'])
@Index('idx_address_user_default', ['user', 'is_default'])
export class Address {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  address_id: number;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người nhận' })
  @Column({ length: 100 })
  recipient_name: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại nhận hàng' })
  @Column({ length: 15 })
  phone: string;

  @ApiProperty({ example: 202, description: 'ID Tỉnh/Thành (theo GHN)' })
  @Column({ type: 'int' })
  province_id: number;

  @ApiProperty({ example: 1444, description: 'ID Quận/Huyện (theo GHN)' })
  @Column({ type: 'int' })
  district_id: number;

  @ApiProperty({ example: '1A0307', description: 'Mã Phường/Xã (theo GHN)' })
  @Column({ length: 20 })
  ward_code: string;

  @ApiProperty({ example: 'Số 123 đường ABC', description: 'Địa chỉ chi tiết' })
  @Column({ length: 255 })
  address_detail: string;

  @ApiProperty({ example: 'Phường Hiệp Bình Chánh, Thành phố Thủ Đức, TP. Hồ Chí Minh' })
  @Column({ length: 500 })
  full_address: string;

  @ApiProperty({ example: false, description: 'Địa chỉ mặc định' })
  @Column({ default: false })
  is_default: boolean;

  @ManyToOne(() => User, (user) => user.user_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 255, name: 'address_note', nullable: true })
  address_note?: string;
}