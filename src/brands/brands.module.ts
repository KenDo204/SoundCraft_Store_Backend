import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { Brand } from './entities/brand.entity'; 
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    CloudinaryModule
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService]
})
export class BrandsModule {}
