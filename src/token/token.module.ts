import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TokenService } from './token.service';
import { TokenController } from './token.controller';
import { Token } from './entities/token.entity';

@Module({
  imports: [
    // 1. Đăng ký Entity Token để TypeORM tạo Repository cho TokenService sử dụng
    TypeOrmModule.forFeature([Token]), 
    
    // 2. Import ConfigModule để TokenService có thể dùng ConfigService (đọc .env)
    ConfigModule 
  ],
  controllers: [TokenController],
  providers: [TokenService],
  
  // 3. Quan trọng: Export TokenService để AuthModule có thể sử dụng (cho login/logout)
  exports: [TokenService], 
})
export class TokenModule {}