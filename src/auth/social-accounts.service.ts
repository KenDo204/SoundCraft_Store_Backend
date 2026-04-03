import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from '@/users/entities/social-account.entity';
import { User } from '@/users/entities/user.entity';

@Injectable()
export class SocialAccountsService {
  constructor(
    @InjectRepository(SocialAccount)
    private readonly socialAccountRepository: Repository<SocialAccount>,
  ) {}

  // --- 1. FIND BY PROVIDER (Thay cho findByProviderAndProviderId) ---
  async findByProviderAndProviderId(
    provider: string,
    providerId: string,
  ): Promise<SocialAccount | null> {
    return this.socialAccountRepository.findOne({
      where: { provider, provider_id: providerId },
      relations: ['user'], // Quan trọng: Lấy kèm luôn User để AuthService dùng được ngay
    });
  }

  // --- 2. CREATE SOCIAL ACCOUNT (Thay cho createSocialAccount) ---
  async createSocialAccount(
    user: User,
    provider: string,
    providerId: string,
  ): Promise<void> {
    const newSocialAccount = this.socialAccountRepository.create({
      user: user,
      provider: provider,
      provider_id: providerId,
      email: user.email,
      name: user.full_name,
    });

    await this.socialAccountRepository.save(newSocialAccount);
  }

  // --- 3. HELPER: FIND USER BY SOCIAL (Tiện cho logic Login Google) ---
  async findUserBySocial(provider: string, providerId: string): Promise<User | null> {
    const socialAccount = await this.findByProviderAndProviderId(provider, providerId);
    return socialAccount ? socialAccount.user : null;
  }
}