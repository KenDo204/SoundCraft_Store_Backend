import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { HomePageService } from './home-page.service';

@ApiTags('Home Page (BFF)')
@Controller('home')
export class HomePageController {
  constructor(private readonly homePageService: HomePageService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Lấy toàn bộ dữ liệu tổng hợp cho màn hình Trang chủ' })
  async getDashboard(@Req() req: any) {
    // Trích xuất userId từ token nếu khách hàng đã đăng nhập.
    // Nếu là khách vãng lai (chưa có token), userId sẽ là undefined.
    const userId = req.user?.userId;

    const data = await this.homePageService.getDashboardData(userId);

    return {
      status: 200,
      message: 'Tải dữ liệu trang chủ thành công',
      data,
    };
  }
}