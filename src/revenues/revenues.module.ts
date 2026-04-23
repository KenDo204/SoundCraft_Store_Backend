import { Module } from '@nestjs/common';
import { RevenuesService } from './revenues.service';
import { RevenuesController } from './revenues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revenue } from './entities/revenue.entity';
import { Product } from '@/products/entities/product.entity';
import { Category } from '@/categories/entities/category.entity';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Revenue, Product, Category, Order, User])],
  controllers: [RevenuesController],
  providers: [RevenuesService],
  exports: [RevenuesService],
})
export class RevenuesModule {}
