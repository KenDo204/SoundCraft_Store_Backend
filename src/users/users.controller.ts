import { Controller, Get, Put, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CurrentUserId } from '../auth/decorators/current-user.decorator'; 
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

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
  async updateMyProfile(
    @CurrentUserId() userId: number, // Sử dụng CurrentUserId của bạn
    @Body() request: UpdateUserDto,
  ) {
    const data = await this.usersService.updateUser(userId, request);
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
}