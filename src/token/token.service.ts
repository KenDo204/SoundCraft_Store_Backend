import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from '@/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly configService: ConfigService, // Thay cho @Value bên Java
  ) {}

  // --- 1. SAVE REFRESH TOKEN ---
  async saveRefreshToken(user: User, refreshToken: string): Promise<void> {
    // Revoke tất cả token cũ của user (Giống Java)
    await this.revokeAllUserTokens(user);

    // Lưu refreshToken mới
    const token = this.tokenRepository.create({
      user: user,
      refresh_token: refreshToken,
      expired: false,
      revoked: false,
    });

    await this.tokenRepository.delete({
      user: { user_id: user.user_id },
      revoked: true, // hoặc kiểm tra thêm điều kiện expired
    });

    await this.tokenRepository.save(token);
  }

  // --- 2. FIND BY REFRESH TOKEN ---
  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'], // Load kèm user để xử lý logic AuthService
    });
  }

  // --- 3. REVOKE ALL USER TOKENS ---
  async revokeAllUserTokens(user: User): Promise<void> {
    // Tìm và cập nhật tất cả token chưa hết hạn của user
    await this.tokenRepository.update(
      { 
        user: { user_id: user.user_id }, 
        revoked: false, 
        expired: false 
      },
      { 
        revoked: true, 
        expired: true 
      },
    );
  }

  // --- 4. ROTATE REFRESH TOKEN ---
  async rotateRefreshToken(storedToken: Token): Promise<void> {
    storedToken.revoked = true;
    storedToken.expired = true;
    await this.tokenRepository.save(storedToken);
  }

  // --- 5. SET REFRESH TOKEN COOKIE ---
  setRefreshTokenCookie(response: Response, refreshToken: string): void {
    // Lấy thời gian hết hạn từ file .env (Ví dụ: 604800000 cho 7 ngày)
    const expiration = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION') || 604800000;

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // Chỉ gửi qua HTTPS
      path: '/',
      maxAge: expiration,
      sameSite: 'strict', // Chống CSRF
    });
  }

  // --- 6. REVOKE TOKEN ---
  async revokeToken(token: string): Promise<void> {
    if (token) {
      const storedToken = await this.findByRefreshToken(token);
      if (storedToken) {
        storedToken.revoked = true;
        storedToken.expired = true;
        await this.tokenRepository.save(storedToken);
      }
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanUpExpiredTokens() {
    console.log('Bắt đầu dọn dẹp token rác...');
    await this.tokenRepository.delete({
      revoked: true, // Xóa các token đã bị thu hồi (khi logout)
    });
    console.log('Dọn dẹp hoàn tất!');
  }
}