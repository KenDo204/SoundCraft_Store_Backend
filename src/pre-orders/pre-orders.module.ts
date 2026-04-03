import { Module } from '@nestjs/common';
import { PreOrdersService } from './pre-orders.service';
import { PreOrdersController } from './pre-orders.controller';

@Module({
  controllers: [PreOrdersController],
  providers: [PreOrdersService],
})
export class PreOrdersModule {}
