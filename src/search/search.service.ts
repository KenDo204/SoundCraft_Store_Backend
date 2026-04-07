import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductSearchDto } from './dto/search.dto';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  /**
   * Rule: Sanitization (Chống XSS và SQL Injection lặt vặt)
   * Kế thừa nguyên vẹn logic Regex từ Java Spring Boot
   */
  private sanitizeKeyword(keyword: string): string {
    if (!keyword) return '';
    return keyword
      .replace(/<[^>]*>/g, ' ') // Xóa thẻ HTML
      .replace(/[^\p{L}\p{Nd}\s]/gu, ' ') // Xóa ký tự đặc biệt, giữ lại chữ, số và khoảng trắng
      .replace(/\s+/g, ' ') // Gộp khoảng trắng thừa
      .trim()
      .toLowerCase();
  }

  /**
   * Tính năng Autocomplete Gợi ý (Alternative for Elasticsearch)
   */
  async getSuggestions(keyword: string): Promise<string[]> {
    const sanitized = this.sanitizeKeyword(keyword);

    // Rule: Giới hạn độ dài từ khóa
    if (sanitized.length < 1 || sanitized.length > 100) {
      return [];
    }

    try {
      // Dùng QueryBuilder kết hợp DISTINCT để mô phỏng Elasticsearch bool_prefix
      const results = await this.productRepo
        .createQueryBuilder('product')
        .select('product.product_name', 'name')
        .where('LOWER(product.product_name) LIKE :keyword', { keyword: `%${sanitized}%` })
        .andWhere('product.is_stock = :isStock', { isStock: true }) // Chỉ gợi ý hàng còn tồn
        .groupBy('product.product_name') // Tránh trùng lặp tên
        .limit(5)
        .getRawMany();

      return results.map(r => r.name);
    } catch (error) {
      // Rule: Graceful Degradation - Lỗi DB search không làm sập trang
      this.logger.error(`Search suggestion degraded for keyword='${sanitized}': ${error.message}`);
      return [];
    }
  }

  /**
   * Tìm kiếm Sản phẩm chính (Full Filter & Pagination)
   */
  async searchProducts(dto: ProductSearchDto) {
    const { 
      keyword = '', 
      categoryId, 
      minPrice, 
      maxPrice, 
      page = 1, 
      size = 20, 
      sort = 'latest' 
    } = dto;
    
    const sanitizedKeyword = this.sanitizeKeyword(keyword);

    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.variants', 'variant')
      .leftJoinAndSelect('product.images', 'image', 'image.is_thumbnail = true') // Chỉ lấy ảnh bìa cho nhẹ
      .where('1=1'); // Dummy where để dễ dàng nối .andWhere()

    // 1. Filter: Keyword
    if (sanitizedKeyword) {
      qb.andWhere(
        '(LOWER(product.product_name) LIKE :kw OR LOWER(product.product_code) LIKE :kw)',
        { kw: `%${sanitizedKeyword}%` }
      );
    }

    // 2. Filter: Category (Giả định bạn có relation category trong Product entity)
    if (categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId });
    }

    // 3. Filter: Khoảng Giá (Dựa trên bảng Variant)
    if (minPrice !== undefined) {
      qb.andWhere('variant.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      qb.andWhere('variant.price <= :maxPrice', { maxPrice });
    }

    // 4. Sorting
    if (sort === 'price_asc') {
      qb.orderBy('variant.price', 'ASC');
    } else if (sort === 'price_desc') {
      qb.orderBy('variant.price', 'DESC');
    } else {
      qb.orderBy('product.created_at', 'DESC'); // 'latest'
    }

    // 5. Pagination
    const skip = (page - 1) * size;
    qb.skip(skip).take(size);

    const [items, totalElements] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        page,
        size,
        totalElements,
        totalPages: Math.ceil(totalElements / size),
      }
    };
  }
}