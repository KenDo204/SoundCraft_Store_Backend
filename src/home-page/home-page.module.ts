import { Module } from '@nestjs/common';
import { HomePageController } from './home-page.controller';
import { HomePageService } from './home-page.service';
import { ProductsModule } from '../products/products.module';
import { RecommendationModule } from '../recommendation/recommendation.module';

@Module({
  imports: [
    // Phải import toàn bộ Module thì NestJS mới cho phép dùng Service bên trong
    ProductsModule, 
    RecommendationModule
  ],
  controllers: [HomePageController],
  providers: [HomePageService],
})
export class HomePageModule {}