import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { DataInitializer } from '@/common/data-initializer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CartsModule } from '@/carts/carts.module';
import { RevenuesModule } from '@/revenues/revenues.module';
import { TokenModule } from '@/token/token.module';
import { AddressesModule } from '@/addresses/addresses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    CartsModule,
    RevenuesModule,
    TokenModule,
    AddressesModule
  ],
  controllers: [UsersController],
  providers: [UsersService, DataInitializer],
  exports: [UsersService],
})
export class UsersModule {}
