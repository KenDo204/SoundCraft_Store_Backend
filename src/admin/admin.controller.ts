import { Controller, Get, Put, Param, Query, Body, UseGuards, HttpStatus, HttpCode, ParseIntPipe, BadRequestException, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator'; // File decorator của bạn
import { UserRole } from '../users/enums/user-role.enum';

@ApiTags('Admin - Users Management')
@ApiBearerAuth()
// Áp dụng Guard cho toàn bộ Controller
@UseGuards(JwtAuthGuard, RolesGuard) 
// Chỉ các Role này mới được phép gọi API trong Controller này
@Roles(UserRole.OWNER, UserRole.ADMIN, UserRole.SUPER_ADMIN) 
@Controller('admin/users')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách người dùng (có phân trang và tìm kiếm)' })
  async getUsers(@Query() query: GetUsersQueryDto) {
    return await this.adminService.getUsers(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết hồ sơ một khách hàng' })
  async getUserDetail(@Param('id', ParseIntPipe) id: number) {
    const data = await this.adminService.getUserDetail(id);
    return {
      status: HttpStatus.OK,
      data,
    };
  }

  @Put(':id/status')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Khóa (Ban) hoặc Mở khóa (Unban) tài khoản' })
  async toggleUserStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('isActive') isActive: boolean,
  ) {
    await this.adminService.toggleUserStatus(id, isActive);
    return {
      status: HttpStatus.OK,
      message: isActive ? 'Đã mở khóa tài khoản thành công' : 'Đã khóa tài khoản thành công',
    };
  }

  @Post(':id/force-reset-password')
  @Roles(UserRole.OWNER, UserRole.ADMIN) // Chỉ Admin/Owner tối cao mới được reset pass người khác
  @ApiOperation({ summary: 'Admin chủ động đặt lại mật khẩu cho khách' })
  async forceResetPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body('newPassword') newPass: string,
  ) {
    if (!newPass || newPass.length < 8) {
      throw new BadRequestException('Mật khẩu mới phải có ít nhất 8 ký tự');
    }
    
    await this.adminService.forceResetPassword(id, newPass);
    return {
      status: HttpStatus.OK,
      message: 'Mật khẩu đã được đặt lại và gửi thông báo tới khách hàng.',
    };
  }
}