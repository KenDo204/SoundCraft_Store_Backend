import { Controller, Get, Put, Body, UseGuards, HttpCode, 
  HttpStatus, UseInterceptors, UploadedFile, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUserId } from '../auth/decorators/current-user.decorator'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 
import { ForgotPasswordDto, ResetPasswordDto } from '@/auth/dto/forgot-password.dto';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard) 
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('account')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân' })
  async getMyProfile(@CurrentUserId() userId: number) {
    const data = await this.usersService.getMyInfo(userId);
    return {
      status: HttpStatus.OK,
      message: 'Lấy thông tin thành công',
      data,
    };
  }

  @Put('account')
  @ApiOperation({ summary: 'Cập nhật thông tin cá nhân' })
  @ApiConsumes('multipart/form-data') // 🌟 BẮT BUỘC có để nhận file từ form-data
  @UseInterceptors(FileInterceptor('file'))
  async updateMyProfile(
    @CurrentUserId() userId: number, // Sử dụng CurrentUserId của bạn
    @Body() request: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.usersService.updateUser(userId, request, file);
    return {
      status: HttpStatus.OK,
      message: 'Cập nhật thông tin thành công',
      data,
    };
  }

  @Put('account/password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Đổi mật khẩu' })
  async changeMyPassword(
    @CurrentUserId() userId: number, // Sử dụng CurrentUserId của bạn
    @Body() request: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(userId, request);
    return {
      status: HttpStatus.OK,
      message: 'Đổi mật khẩu thành công',
    };
  }

  // @Post('forgot-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Yêu cầu gửi mã OTP đặt lại mật khẩu qua Email' })
  // async forgotPassword(@Body() dto: ForgotPasswordDto) {
  //   await this.usersService.requestForgotPassword(dto.email);
    
  //   // Luôn trả về câu thông báo chung chung để bảo mật
  //   return {
  //     status: HttpStatus.OK,
  //     message: 'Nếu email tồn tại trong hệ thống, mã xác nhận (OTP) đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
  //   };
  // }

  // @Post('reset-password')
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({ summary: 'Xác nhận mã OTP và đặt lại mật khẩu mới' })
  // async resetPassword(@Body() dto: ResetPasswordDto) {
  //   await this.usersService.resetPasswordWithOtp(dto);
    
  //   return {
  //     status: HttpStatus.OK,
  //     message: 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại bằng mật khẩu mới.',
  //   };
  // }
}