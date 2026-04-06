import { Injectable, UnauthorizedException, BadRequestException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/users/users.service';
import { TokenService } from '@/token/token.service'; // Bạn sẽ tạo service quản lý bảng tokens
import { SocialAccountsService } from './social-accounts.service';
import { RegisterDto, LoginDto, LoginResponseDto, LoginWithGoogleDto } from './dto/auth.dto';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { User } from '@/users/entities/user.entity';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly tokensService: TokenService,
    private readonly socialAccountService: SocialAccountsService,
  ) {}

  // --- HELPER: BUILD LOGIN RESPONSE (Giống buildLoginResponse bên Java) ---
  private async buildLoginResponse(user: User, response: Response): Promise<LoginResponseDto> {
    const payload = { sub: user.user_id, email: user.email, role: user.role };
    
    // 1. Sinh Access Token & Refresh Token
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
    
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    // 2. Lưu Refresh Token vào bảng 'tokens' trong DB
    await this.tokensService.saveRefreshToken(user, refreshToken);

    // 3. Thiết lập Cookie (HttpOnly)
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true, // Chỉ chạy qua HTTPS (trong dev có thể tắt nếu cần)
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
    });

    return {
      access_token: accessToken,
      user: {
        id: Number(user.user_id),
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar,
      },
    };
  }

  // --- 1. LOGIN ---
  async login(loginDto: LoginDto, response: Response) {
    const user = await this.usersService.findUserByEmail(loginDto.email);

    console.log('User tìm thấy:', user?.email);
    console.log('Hash từ DB:', user?.password);
  
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // So sánh mật khẩu bằng bcrypt (Thay cho AuthenticationManager của Spring)
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    if (!user.is_active) {
      throw new BadRequestException('Tài khoản đã bị khóa');
    }

    return this.buildLoginResponse(user, response);
  }

  // --- 2. REGISTER ---
  async register(registerDto: RegisterDto, response: Response) {
    // Kiểm tra email tồn tại
    const existingUser = await this.usersService.findUserByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email đã được sử dụng');
    }

    // Tạo user mới (Mã hóa pass sẽ nằm trong usersService.create)
    const newUser = await this.usersService.createUser(registerDto);

    return this.buildLoginResponse(newUser, response);
  }

  // --- 3. REFRESH TOKEN (Layer 1 & Layer 2) ---
  async refreshToken(token: string, response: Response) {
    if (!token) throw new UnauthorizedException('Token không tồn tại');

    try {
      // Layer 1: Validate JWT signature
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Layer 2: Check trong DB (đảm bảo chưa bị revoked)
      const storedToken = await this.tokensService.findByRefreshToken(token);
      if (!storedToken || storedToken.expired || storedToken.revoked) {
        throw new UnauthorizedException('Phiên đăng nhập đã hết hạn hoặc bị thu hồi');
      }

      // Rotate Token: Xóa token cũ trong DB
      await this.tokensService.revokeToken(token);
      
      const user = await this.usersService.findUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('Người dùng không tồn tại');
      }
      return this.buildLoginResponse(user, response);
    } catch (e) {
      throw new UnauthorizedException('Token không hợp lệ');
    }
  }

  // --- 4. LOGOUT ---
  async logout(refreshToken: string, response: Response) {
    if (refreshToken) {
      await this.tokensService.revokeToken(refreshToken);
    }
    response.clearCookie('refresh_token');
  }

  // --- 5. GET ACCOUNT ---
  async getMyAccount(userId: number) {
    const user = await this.usersService.findUserById(userId);
    if (!user) throw new UnauthorizedException('Vui lòng đăng nhập');
    
    return {
      user: {
        id: Number(user.user_id),
        full_name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        role: user.role,
        avatar: user.avatar,
      }
    };
  }

  // --- 6. GOOGLE LOGIN ---
  async loginWithGoogle(dto: LoginWithGoogleDto, response: Response) {
    try {
      const ticket = await client.verifyIdToken({
        idToken: dto.token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.name || !payload.sub) {
        throw new BadRequestException('Token không hợp lệ hoặc thiếu thông tin');
      }
      const { email, name, picture, sub: providerId } = payload;
      const avatarUrl = picture || '';
      // Tìm hoặc tạo User & SocialAccount (Giống logic resolveUser bên Java)
      let user = await this.socialAccountService.findUserBySocial('GOOGLE', providerId as string);

      if (!user) {
        user = await this.usersService.findUserByEmail(email as string);
        if (!user) {
          user = await this.usersService.createUserFromSocial(name as string, email as string, avatarUrl);
        }
        await this.socialAccountService.createSocialAccount(user, 'GOOGLE', providerId as string);
      }

      return this.buildLoginResponse(user, response);
    } catch (error) {
      throw new BadRequestException('Đăng nhập Google thất bại');
    }
  }

  async createAccessToken(user: User) {
    const payload = {
      sub: user.email,
      // Claim "user" chứa object lồng nhau y hệt LoginResponse.UserInsideToken của Java
      user: {
        id: Number(user.user_id),
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      scope: [user.role], // claim "scope" để phân quyền
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
      algorithm: 'HS512', // Sử dụng HS512 như Java
    });
  }
  
}