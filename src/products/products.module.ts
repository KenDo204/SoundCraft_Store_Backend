import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Brand } from '@/brands/entities/brand.entity';
import { ProductImage } from './entities/product-image.entity';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [
    // 1. Đăng ký cả Product và Brand vào đây
    TypeOrmModule.forFeature([Product, Brand, ProductImage]),
    CloudinaryModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService],

  // 2. Export ProductsService để các module khác (như Carts, Orders) có thể dùng
  exports: [ProductsService],
})
export class ProductsModule { }