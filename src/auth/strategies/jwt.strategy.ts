import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// Thêm interface để định nghĩa rõ ràng kiểu dữ liệu của Token Payload
export interface JwtPayload {
  sub: number; // Trong JWT chuẩn, 'sub' thường dùng để lưu ID
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: (configService.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET) as string, 
    });
  }

  // Đổi từ (payload: any) sang (payload: JwtPayload)
  async validate(payload: JwtPayload) {
    if (!payload) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    // Lúc này IDE sẽ tự động gợi ý code (autocomplete) cho payload.sub, payload.email
    return { 
      id: payload.sub,
      email: payload.email, 
      role: payload.role
    };
  }
}