import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity('product_similarities')
export class ProductSimilarity {
  @ApiProperty({ description: 'ID Sản phẩm gốc' })
  @PrimaryColumn({ type: 'bigint' })
  product_id: number;

  @ApiProperty({ description: 'ID Sản phẩm tương tự' })
  @PrimaryColumn({ type: 'bigint' })
  similar_product_id: number;

  @ApiProperty({ description: 'Điểm số tương đồng (Càng cao càng giống nhau)' })
  @Column({ type: 'double precision', nullable: true })
  score: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'similar_product_id' })
  similarProduct: Product;
}