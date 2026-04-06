import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { GhnController } from './ghn.controller';
import { GhnService } from './ghn.service';

@Module({
  imports: [
    HttpModule,
    CacheModule.register(), // Khởi tạo In-memory Cache
  ],
  controllers: [GhnController],
  providers: [GhnService],
  exports: [GhnService], // Export để các module khác (như OrderModule) có thể dùng chung
})
export class GhnModule {}