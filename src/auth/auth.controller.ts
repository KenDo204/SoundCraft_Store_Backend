import { Controller, Post, Body, Get, Res, Req, UseGuards, HttpStatus, HttpCode } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, LoginWithGoogleDto } from './dto/auth.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/forgot-password.dto';
import { UsersService } from '@/users/users.service';

@ApiTags('Auth - Nghiệp vụ xác thực')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) { }

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  async register(@Body() registerDto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.register(registerDto, res);
    return { status: 201, message: 'Đăng ký thành công', data: result };
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập truyền thống (Email/Password)' })
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(loginDto, res);
    return { status: 200, message: 'Đăng nhập thành công', data: result };
  }

  @Get('refresh-token')
  @ApiOperation({ summary: 'Lấy Access Token mới bằng Refresh Token từ Cookie' })
  async refreshToken(@Req() request: Request, @Res({ passthrough: true }) response: Response) { // Thêm passthrough
    const refreshToken = request.cookies['refresh_token'];
    const result = await this.authService.refreshToken(refreshToken, response);
    return { status: 200, message: 'Lấy token mới thành công', data: result };
  }

  @Post('logout')
  @ApiOperation({ summary: 'Đăng xuất và xóa Cookie' })
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) { // Thêm passthrough
    const refreshToken = request.cookies['refresh_token'];
    await this.authService.logout(refreshToken, response);
    return { status: 200, message: 'Đăng xuất thành công' };
  }

  @UseGuards(AuthGuard('jwt')) // <--- QUAN TRỌNG: Phải có cái này thì req.user mới có dữ liệu
  @ApiBearerAuth('JWT-auth')
  @Get('account')
  @ApiOperation({ summary: 'Lấy thông tin tài khoản đang đăng nhập' })
  async getAccount(@Req() req: any) {
    const user = await this.authService.getMyAccount(req.user.id); // Lấy id từ JwtStrategy
    return { status: 200, data: user };
  }

  @Post('login/social/google')
  @ApiOperation({ summary: 'Đăng nhập bằng Google' })
  async loginGoogle(@Body() dto: LoginWithGoogleDto, @Res({ passthrough: true }) res: Response) { // Thêm passthrough
    const result = await this.authService.loginWithGoogle(dto, res);
    return { status: 200, message: 'Đăng nhập Google thành công', data: result };
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Gửi yêu cầu quên mật khẩu (Nhận OTP qua mail)' })
  async forgotPassword(@Body() dto: ForgotPasswordDto) {
    await this.usersService.requestForgotPassword(dto.email);
    return {
      status: HttpStatus.OK,
      message: 'Nếu email tồn tại trong hệ thống, mã xác nhận OTP sẽ được gửi đến hòm thư của bạn.',
    };
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đặt lại mật khẩu mới bằng mã OTP' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.usersService.resetPasswordWithOtp(dto);
    return {
      status: HttpStatus.OK,
      message: 'Đổi mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.',
    };
  }
}