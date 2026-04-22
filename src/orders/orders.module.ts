import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { User } from '@/users/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { AddressesModule } from '@/addresses/addresses.module';
import { InventoryModule } from '@/inventory/inventory.module';
import { GhnModule } from '@/ghn/ghn.module';
import { VnpayModule } from '@/vnpay/vnpay.module';
import { NotificationsModule } from '@/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, User, Transaction]),
    AddressesModule,
    InventoryModule,
    GhnModule,
    VnpayModule,
    NotificationsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
