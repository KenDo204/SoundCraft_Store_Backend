import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { RecommendationResponseDto } from './dto/recommendation.dto';

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  /**
   * Chuyển đổi Entity Product sang DTO rút gọn dùng cho UI Card
   */
  private toRecommendationResponse(product: Product): RecommendationResponseDto {
    // Trích xuất ảnh thumbnail
    const thumbnailUrl = product.images?.find(img => img.is_thumbnail)?.image_url || null;

    // Lấy giá thấp nhất từ danh sách biến thể (ví dụ: Guitar size 3/4 thường rẻ hơn 4/4)
    const minPrice = product.variants?.length > 0
      ? Math.min(...product.variants.map(v => Number(v.price)))
      : 0;

    return {
      productId: Number(product.product_id),
      productName: product.product_name,
      productCode: product.product_code,
      thumbnailUrl,
      minPrice,
      isStock: product.is_stock,
    };
  }

  /**
   * Lấy sản phẩm tương tự (Cùng Brand)
   */
  async getSimilarProducts(productId: number): Promise<RecommendationResponseDto[]> {
    // 1. Tìm sản phẩm gốc để lấy brand_id
    const currentProduct = await this.productRepo.findOne({
      where: { product_id: productId },
      relations: ['brand'],
    });

    if (!currentProduct) {
      throw new NotFoundException('Không tìm thấy sản phẩm');
    }

    // 2. Query sản phẩm cùng brand, loại trừ sản phẩm hiện tại
    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image', 'image.is_thumbnail = true')
      .leftJoinAndSelect('product.variants', 'variant')
      .where('product.product_id != :productId', { productId })
      .andWhere('product.is_stock = :isStock', { isStock: true }); // Chỉ gợi ý hàng còn tồn

    if (currentProduct.brand?.brand_id) {
      qb.andWhere('product.brand_id = :brandId', { brandId: currentProduct.brand.brand_id });
    }

    // Lấy tối đa 10 sản phẩm, sắp xếp mới nhất
    const similarProducts = await qb
      .orderBy('product.created_at', 'DESC')
      .take(10)
      .getMany();

    return similarProducts.map(product => this.toRecommendationResponse(product));
  }

  /**
   * Lấy gợi ý cho User (Mô phỏng bằng hàng phổ biến nếu chưa có thuật toán AI)
   */
  async getForYouProducts(userId: number): Promise<RecommendationResponseDto[]> {
    // Ở hệ thống thực tế lớn, ta sẽ gọi sang 1 service Python AI/ML qua gRPC
    // Tạm thời fallback: Trả về danh sách nhạc cụ đang nổi bật
    const forYouProducts = await this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'image', 'image.is_thumbnail = true')
      .leftJoinAndSelect('product.variants', 'variant')
      .where('product.in_popular = :isPopular', { isPopular: true })
      .andWhere('product.is_stock = :isStock', { isStock: true })
      // Sắp xếp ngẫu nhiên để user không bị nhàm chán mỗi lần load trang
      .orderBy('RANDOM()') 
      .take(20)
      .getMany();

    return forYouProducts.map(product => this.toRecommendationResponse(product));
  }
}