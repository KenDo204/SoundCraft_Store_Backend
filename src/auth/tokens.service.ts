import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
  ) {}

  async findByRefreshToken(refreshToken: string): Promise<Token | null> {
    return this.tokenRepository.findOne({
      where: { refresh_token: refreshToken },
      relations: ['user'],
    });
  }

  async saveRefreshToken(user: User, refreshToken: string): Promise<void> {
    // 1. Thu hồi (Revoke) tất cả token cũ của user này trước khi lưu cái mới
    await this.revokeAllUserTokens(user.user_id);

    // 2. Lưu token mới
    const token = this.tokenRepository.create({
      refresh_token: refreshToken,
      user: user,
      revoked: false,
      expired: false,
    });
    await this.tokenRepository.save(token);
  }

  async revokeAllUserTokens(userId: number): Promise<void> {
    await this.tokenRepository.update(
      { user: { user_id: userId }, revoked: false },
      { revoked: true, expired: true },
    );
  }

  async deleteToken(refreshToken: string): Promise<void> {
    // Soft delete bằng cách set revoked = true (giống logic Java của bạn)
    await this.tokenRepository.update(
      { refresh_token: refreshToken },
      { revoked: true, expired: true },
    );
  }
}