import { Module } from '@nestjs/common';
import { PreOrdersService } from './pre-orders.service';
import { PreOrdersController } from './pre-orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreOrder } from './entities/pre-order.entity';
import { Product } from '@/products/entities/product.entity';
import { User } from '@/users/entities/user.entity';
import { NotificationsModule } from '@/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PreOrder, Product, User]),
    NotificationsModule,
  ],
  controllers: [PreOrdersController],
  providers: [PreOrdersService],
})
export class PreOrdersModule {}
