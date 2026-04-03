import { Controller, Post, Body, Get, Res, Req, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LoginWithGoogleDto } from './dto/auth.dto';

@ApiTags('Auth - Nghiệp vụ xác thực')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(registerDto, res);
    return { statusCode: 201, message: 'Đăng ký thành công', data: result };
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập truyền thống (Email/Password)' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto, res);
    return { statusCode: 200, message: 'Đăng nhập thành công', data: result };
  }

  @Get('refresh-token')
  @ApiOperation({ summary: 'Lấy Access Token mới bằng Refresh Token từ Cookie' })
  async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) { // Thêm passthrough
    const refreshToken = request.cookies['refresh_token'];
    const result = await this.authService.refreshToken(refreshToken, response);
    return { statusCode: 200, message: 'Lấy token mới thành công', data: result };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất và xóa Cookie' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) { // Thêm passthrough
    const refreshToken = request.cookies['refresh_token'];
    await this.authService.logout(refreshToken, response);
    return { statusCode: 200, message: 'Đăng xuất thành công' };
  }

  @UseGuards(AuthGuard('jwt')) // <--- QUAN TRỌNG: Phải có cái này thì req.user mới có dữ liệu
  @ApiBearerAuth('JWT-auth')
  @Get('account')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
  async getAccount(@Req() req: any) {
    const user = await this.authService.getMyAccount(req.user.id); // Lấy id từ JwtStrategy
    return { statusCode: 200, data: user };
  }

  @Post('login/social/google')
  @ApiOperation({ summary: 'Đăng nhập bằng Google' })
  async loginGoogle(@Body() dto: LoginWithGoogleDto, @Res({ passthrough: true }) res: Response) { // Thêm passthrough
    const result = await this.authService.loginWithGoogle(dto, res);
    return { statusCode: 200, message: 'Đăng nhập Google thành công', data: result };
  }

  // Vì không dùng OTP, phần Quên mật khẩu sẽ được xử lý qua link email (nếu cần sau này)
  // Tạm thời bỏ các endpoint liên quan đến OTP để code chạy sạch.
}