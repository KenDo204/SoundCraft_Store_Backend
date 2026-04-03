import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // <--- 1. IMPORT THÊM DÒNG NÀY
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from '@/token/entities/token.entity';
import { SocialAccount } from '@/users/entities/social-account.entity';
import { TokenService } from '@/token/token.service';
import { SocialAccountsService } from './social-accounts.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CartsModule } from 'src/carts/carts.module';

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({ defaultStrategy: 'jwt' }), // <--- 2. KHAI BÁO NÓ VÀO ĐÂY
    JwtModule.register({
      secret: process.env.JWT_ACCESS_SECRET || 'your_backup_secret_key',
      signOptions: { expiresIn: '15m' }, 
    }), 
    TypeOrmModule.forFeature([Token, SocialAccount]), 
    CartsModule, 
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    TokenService, 
    SocialAccountsService,
    JwtStrategy 
  ],
})
export class AuthModule {}