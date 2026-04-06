import { Module } from '@nestjs/common';
import { AddressService } from './addresses.service';
import { AddressController } from './addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { GhnModule } from 'src/ghn/ghn.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    GhnModule
  ],
  controllers: [AddressController],
  providers: [AddressService],
  exports: [AddressService],
})
export class AddressesModule {}
