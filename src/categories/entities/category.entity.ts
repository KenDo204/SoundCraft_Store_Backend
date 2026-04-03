import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '@/products/entities/product.entity';

@Entity('categories')
export class Category {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn({ type: 'bigint' })
  category_id: number;

  @ApiProperty({ example: 'Đàn Guitar', description: 'Tên danh mục' })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({ example: 1, description: 'Cấp độ danh mục' })
  @Column({ type: 'int', default: 1 })
  level: number;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}