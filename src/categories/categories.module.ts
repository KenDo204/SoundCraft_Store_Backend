import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category } from './entities/category.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module'; // Đường dẫn tới module Cloudinary của bạn

@Module({
  imports: [
    // 1. Kết nối Entity Category với TypeORM
    TypeOrmModule.forFeature([Category]),
    
    // 2. Import module xử lý ảnh để Service dùng được CloudinaryService
    CloudinaryModule, 
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
