import { Controller, Get, Param } from '@nestjs/common';
import { RevenuesService } from './revenues.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { MonthlyRevenueResponseDto } from './dto/monthly-revenue-response.dto';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';

@ApiTags('Revenues')
@Controller('revenues')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @ApiOperation({ summary: 'Lấy các chỉ số thống kê cho Dashboard Admin' })
  @ApiResponse({ status: 200, type: DashboardStatsResponseDto })
  @Get('dashboard-stats')
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth('JWT-auth')
  async getStats(@CurrentUserId() userId: number): Promise<any> {
    const data = await this.revenuesService.getDashboardStats(userId);
    return {
      status: 200,
      message: 'Lấy thống kê thành công',
      data
    };
  }

  @ApiOperation({ summary: 'Lấy doanh thu theo tháng' })
  @ApiResponse({ status: 200, type: [MonthlyRevenueResponseDto] })
  @Get('monthly-revenue/:year')
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth('JWT-auth')
  async getMonthlyRevenue(@Param('year') year: string): Promise<any> {
    const data = await this.revenuesService.getMonthlyRevenue(+year);
    return {
      status: 200,
      message: 'Lấy doanh thu theo tháng thành công',
      data
    };
  }

  @Get()
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth('JWT-auth')
  findAll() {
    return this.revenuesService.findAll();
  }

  @Get(':id')
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth('JWT-auth')
  findOne(@Param('id') id: string) {
    return this.revenuesService.findOne(+id);
  }
}
