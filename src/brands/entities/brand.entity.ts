import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  OneToMany, 
  CreateDateColumn, 
  UpdateDateColumn 
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@/products/entities/product.entity';

@Entity('brands')
export class Brand {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  brand_id: number;

  @ApiProperty({ example: 'YAMAHA', description: 'Mã định danh duy nhất của thương hiệu' })
  @Column({ length: 50, unique: true })
  brand_code: string;

  @ApiProperty({ example: 'Đàn Guitar', description: 'Tên danh mục' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 'soundcraft/brands/yamaha_logo.png' })
  @Column({ type: 'text', nullable: true })
  brand_image: string | null;

  @ApiProperty({ example: true })
  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}