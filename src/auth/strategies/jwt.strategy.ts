import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Ép kiểu (as string) để TypeScript không còn phàn nàn về vụ undefined nữa
      secretOrKey: (configService.get<string>('JWT_ACCESS_SECRET') || process.env.JWT_ACCESS_SECRET) as string, 
    });
  }

  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Token không hợp lệ');
    }

    return { 
      id: payload.sub,
      email: payload.email, 
      role: payload.role
    };
  }
}