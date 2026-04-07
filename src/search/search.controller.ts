import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { SuggestionQueryDto, ProductSearchDto } from './dto/search.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /**
   * API Gợi ý từ khóa
   * Áp dụng Rate Limit: 20 request / 1 giây (Tương đương code Java cũ)
   * Sử dụng @Throttle({ default: { limit: 20, ttl: 1000 } }) - syntax cho throttler v6
   */
  @Get('suggestions')
  @ApiOperation({ summary: 'Lấy danh sách gợi ý tìm kiếm (Rate Limited)' })
  @Throttle({ default: { limit: 20, ttl: 1000 } }) 
  async getSuggestions(@Query() query: SuggestionQueryDto) {
    return this.searchService.getSuggestions(query.q || '');
  }

  /**
   * API Tìm kiếm sản phẩm
   */
  @Get('products')
  @ApiOperation({ summary: 'Tìm kiếm sản phẩm với nhiều bộ lọc' })
  async searchProducts(@Query() query: ProductSearchDto) {
    const data = await this.searchService.searchProducts(query);
    return {
      status: 200,
      message: 'Tìm kiếm sản phẩm thành công',
      data,
    };
  }
}