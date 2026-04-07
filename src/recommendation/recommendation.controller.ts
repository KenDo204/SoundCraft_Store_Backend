import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RecommendationService } from './recommendation.service';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('products/:id/similar')
  @ApiOperation({ summary: 'Lấy danh sách nhạc cụ tương tự' })
  async getSimilarProducts(@Param('id', ParseIntPipe) id: number) {
    const data = await this.recommendationService.getSimilarProducts(id);
    return {
      status: 200,
      message: 'Lấy danh sách sản phẩm tương tự thành công',
      data,
    };
  }

  @Get('users/:userId/for-you')
  @ApiOperation({ summary: 'Lấy danh sách gợi ý cá nhân hóa cho người dùng' })
  async getForYouProducts(@Param('userId', ParseIntPipe) userId: number) {
    // Lưu ý bảo mật: Trong thực tế, userId nên được lấy từ JWT Token (Req.user)
    // để tránh việc user này truyền ID của user khác vào URL để xem gợi ý.
    const data = await this.recommendationService.getForYouProducts(userId);
    return {
      status: 200,
      message: 'Lấy danh sách gợi ý cho bạn thành công',
      data,
    };
  }
}