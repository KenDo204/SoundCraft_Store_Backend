import { Controller, Get, Post, Put, Delete, Body, Param, Query, ParseIntPipe, ParseBoolPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@ApiTags('Products (Nhạc cụ)')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo sản phẩm nhạc cụ mới kèm biến thể và hình ảnh' })
  async createProduct(@Body() dto: CreateProductDto) {
    return {
      message: 'Tạo sản phẩm thành công',
      data: await this.productsService.createProduct(dto),
    };
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm (Hỗ trợ Search, Pagination)' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'isPopular', required: false, type: Boolean })
  async getProducts(
    @Query('keyword') keyword?: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('isPopular') isPopular?: string,
  ) {
    const popularFlag = isPopular ? isPopular === 'true' : undefined;
    return {
      message: 'Lấy danh sách thành công',
      data: await this.productsService.getProducts(keyword, +page, +limit, popularFlag),
    };
  }

  @Get('popular')
  @ApiOperation({ summary: 'Lấy danh sách các nhạc cụ bán chạy/phổ biến' })
  async getPopularProducts(@Query('limit') limit: string = '5') {
    return {
      message: 'Lấy danh sách nhạc cụ phổ biến thành công',
      data: await this.productsService.getProducts('', 1, +limit, true),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết sản phẩm' })
  async getProductById(@Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Lấy thông tin chi tiết thành công',
      data: await this.productsService.getProductById(id),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật toàn bộ thông tin sản phẩm' })
  async updateProduct(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateProductDto) {
    return {
      message: 'Cập nhật sản phẩm thành công',
      data: await this.productsService.updateProduct(id, dto),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return await this.productsService.deleteProduct(id);
  }
}