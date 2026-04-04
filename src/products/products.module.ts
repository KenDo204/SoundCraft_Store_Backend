import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Brand } from '@/brands/entities/brand.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
  imports: [
    // 1. Đăng ký cả Product và Brand vào đây
    TypeOrmModule.forFeature([Product, Brand, ProductVariant, ProductImage]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],

  // 2. Export ProductsService để các module khác (như Carts, Orders) có thể dùng
  exports: [ProductsService],
})
export class ProductsModule { }