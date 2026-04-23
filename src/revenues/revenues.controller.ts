import { Controller, Get, Param } from '@nestjs/common';
import { RevenuesService } from './revenues.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { MonthlyRevenueResponseDto } from './dto/monthly-revenue-response.dto';

@ApiTags('Revenues')
@Controller('revenues')
export class RevenuesController {
  constructor(private readonly revenuesService: RevenuesService) {}

  @ApiOperation({ summary: 'Lấy các chỉ số thống kê cho Dashboard Admin' })
  @ApiResponse({ status: 200, type: DashboardStatsResponseDto })
  @Get('dashboard-stats')
  async getStats(): Promise<DashboardStatsResponseDto> {
    return await this.revenuesService.getDashboardStats();
  }

  @ApiOperation({ summary: 'Lấy doanh thu theo tháng' })
  @ApiResponse({ status: 200, type: [MonthlyRevenueResponseDto] })
  @Get('monthly-revenue/:year')
  async getMonthlyRevenue(@Param('year') year: string): Promise<MonthlyRevenueResponseDto[]> {
    return await this.revenuesService.getMonthlyRevenue(+year);
  }

  @Get()
  findAll() {
    return this.revenuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.revenuesService.findOne(+id);
  }
}
