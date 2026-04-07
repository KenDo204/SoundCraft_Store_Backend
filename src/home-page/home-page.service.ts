import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { RecommendationService } from '../recommendation/recommendation.service';

@Injectable()
export class HomePageService {
  private readonly logger = new Logger(HomePageService.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly recommendationService: RecommendationService,
    // Nếu bạn có CategoryService thì inject thêm vào đây
  ) {}

  async getDashboardData(userId?: number) {
    try {
      // Sử dụng Promise.all để gọi đồng thời xuống Database thay vì gọi tuần tự
      // Giúp giảm thời gian chờ xuống chỉ bằng thời gian của câu query chậm nhất
      const [latestProducts, popularProducts, forYouProducts] = await Promise.all([
        // 1. Lấy 10 nhạc cụ mới nhất
        this.productsService.getProducts('', 1, 10), 
        
        // 2. Lấy 10 nhạc cụ bán chạy/phổ biến (isPopular = true)
        this.productsService.getProducts('', 1, 10, true), 
        
        // 3. Lấy gợi ý nếu user đã đăng nhập, ngược lại trả về mảng rỗng
        userId ? this.recommendationService.getForYouProducts(userId) : Promise.resolve([]),
      ]);

      // Gom toàn bộ data lại thành một khối thống nhất cho UI
      return {
        latestProducts: latestProducts.items,
        popularProducts: popularProducts.items,
        forYouProducts: forYouProducts,
      };
    } catch (error: any) {
      this.logger.error(`Lỗi khi load dữ liệu trang chủ: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Không thể tải dữ liệu trang chủ lúc này');
    }
  }
}