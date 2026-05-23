import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review, ReviewImage, OrderItem]),
    CloudinaryModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [ReviewsService],
})
export class ReviewsModule {}
