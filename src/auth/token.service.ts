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
    private readonly configService: ConfigService,
  ) {}

  /**
   * --- 1. LƯU REFRESH TOKEN MỚI ---
   * Thu hồi các token cũ trước khi lưu cái mới để đảm bảo mỗi user chỉ có 1 session active (hoặc quản lý theo session nếu cần)
   */
  async saveRefreshToken(user: User, refreshToken: string): Promise<void> {
    // 1. Thu hồi (Revoke) tất cả token cũ của user này
    await this.revokeAllUserTokens(Number(user.user_id));

    // 2. Lưu token mới
    const token = this.tokenRepository.create({
      refresh_token: refreshToken,
      user: user,
      revoked: false,
      expired: false,
    });
    
    await this.tokenRepository.save(token);
  }

  /**
   * --- 2. TÌM TOKEN THEO CHUỖI REFRESH TOKEN ---
   */
  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
    });
  }

  /**
   * --- 3. THU HỒI TẤT CẢ TOKEN CỦA USER ---
   */
  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.tokenRepository.update(
      { user: { user_id: userId }, revoked: false },
      { revoked: true, expired: true },
    );
  }

  /**
   * --- 4. XOAY VÒNG TOKEN (ROTATE) ---
   * Đánh dấu token hiện tại là đã sử dụng (revoked/expired)
   */
  async rotateRefreshToken(refreshToken: string): Promise<void> {
    await this.tokenRepository.update(
      { refresh_token: refreshToken },
      { revoked: true, expired: true },
    );
  }

  /**
   * --- 5. CẤU HÌNH COOKIE REFRESH TOKEN ---
   */
  setRefreshTokenCookie(response: Response, refreshToken: string): void {
    const expiration = this.configService.get<number>('JWT_REFRESH_TOKEN_EXPIRATION') || 604800000; // Mặc định 7 ngày

    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Chỉ bật secure trên production (HTTPS)
      path: '/',
      maxAge: expiration,
      sameSite: 'strict',
    });
  }

  /**
   * --- 6. THU HỒI MỘT TOKEN CỤ THỂ (Dùng khi LOGOUT hoặc REFRESH) ---
   */
  async revokeToken(token: string): Promise<void> {
    if (!token) return;
    
    await this.tokenRepository.update(
      { refresh_token: token },
      { revoked: true, expired: true },
    );
  }

  /**
   * --- 7. TỰ ĐỘNG DỌN DẸP TOKEN RÁC ---
   * Run lúc 3:00 sáng mỗi ngày để xóa các token đã revoke/expired trong DB
   */
  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanUpExpiredTokens() {
    console.log('[TokenService] Bắt đầu dọn dẹp token rác...');
    try {
      const result = await this.tokenRepository.delete({
        revoked: true,
      });
      console.log(`[TokenService] Đã xóa ${result.affected} token cũ.`);
    } catch (error) {
      console.error('[TokenService] Lỗi khi dọn dẹp token:', error);
    }
  }
}
