import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('revenues')
export class Revenue {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  revenue_id: number;

  @ApiProperty({ example: '2024-03-20' })
  @Column({ type: 'date', nullable: true })
  revenue_date: Date;

  @ApiProperty({ example: 3, description: 'Tháng (0-11)' })
  @Column({ type: 'smallint', nullable: true })
  revenue_month: number;

  @ApiProperty({ example: 5000000.00 })
  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  total_money: number;

  @ApiProperty({ example: 10 })
  @Column({ type: 'int', nullable: true })
  total_order: number;
}