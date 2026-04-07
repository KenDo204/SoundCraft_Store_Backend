import { Entity, PrimaryGeneratedColumn, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('admin_audit_logs')
@Index('idx_audit_admin', ['admin'])
@Index('idx_audit_action', ['action_type'])
export class AdminAuditLog {
  @ApiProperty({ description: 'ID của log kiểm toán' })
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  log_id: number;

  @ApiProperty({ description: 'Thời điểm thực hiện hành động (Khóa chính tổ hợp cho Partitioning)' })
  @PrimaryColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ApiProperty({ description: 'Loại hành động (CREATE, UPDATE, DELETE...)' })
  @Column({ type: 'varchar', length: 50 })
  action_type: string;

  @ApiProperty({ description: 'Bảng/Entity bị tác động (Ví dụ: PRODUCT, ORDER)' })
  @Column({ type: 'varchar', length: 50 })
  target_entity: string;

  @ApiProperty({ description: 'ID của record bị tác động' })
  @Column({ type: 'bigint' })
  target_id: number;

  @ApiPropertyOptional({ description: 'Dữ liệu trước khi sửa (Dùng để rollback nếu cần)' })
  @Column({ type: 'jsonb', nullable: true })
  old_data: any;

  @ApiPropertyOptional({ description: 'Dữ liệu sau khi sửa' })
  @Column({ type: 'jsonb', nullable: true })
  new_data: any;

  @ApiPropertyOptional({ description: 'Địa chỉ IP của Admin' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  ip_address: string;

  @ApiPropertyOptional({ description: 'Thông tin trình duyệt/thiết bị của Admin' })
  @Column({ type: 'varchar', length: 255, nullable: true })
  user_agent: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'admin_id' })
  admin: User;
}