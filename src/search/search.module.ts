import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { Product } from '../products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    // Khởi tạo ThrottlerModule để quản lý Rate Limiting
    ThrottlerModule.forRoot([{
      ttl: 1000, // 1000 ms = 1 giây
      limit: 100, // Limit chung cho toàn app nếu muốn, endpoint suggestion sẽ đè lại rule 20 req/s
    }]),
  ],
  controllers: [SearchController],
  providers: [
    SearchService,
    // Kích hoạt Guard chống spam cho toàn bộ module Search
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  exports: [SearchService],
})
export class SearchModule {}