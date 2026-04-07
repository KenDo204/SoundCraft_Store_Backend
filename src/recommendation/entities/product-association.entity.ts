import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity('product_associations')
export class ProductAssociation {
  @ApiProperty({ description: 'ID Sản phẩm nguồn (Sản phẩm khách đang mua)' })
  @PrimaryColumn({ type: 'bigint' })
  product_id: number;

  @ApiProperty({ description: 'ID Sản phẩm thường được mua kèm (Related)' })
  @PrimaryColumn({ type: 'bigint' })
  related_product_id: number;

  @ApiPropertyOptional({ description: 'Độ tin cậy (Confidence) của luật kết hợp' })
  @Column({ type: 'double precision', nullable: true })
  confidence: number;

  @ApiPropertyOptional({ description: 'Độ nâng (Lift) của luật kết hợp' })
  @Column({ type: 'double precision', nullable: true })
  lift: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'related_product_id' })
  relatedProduct: Product;
}