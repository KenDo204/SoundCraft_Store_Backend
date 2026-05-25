import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  ParseIntPipe, 
  DefaultValuePipe, 
  HttpCode, 
  HttpStatus, 
  UploadedFiles, 
  UseInterceptors 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';


@ApiTags('Products (Quản lý Nhạc cụ)')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // =====================================
  // 1. TẠO SẢN PHẨM (KÈM UPLOAD ẢNH)
  // =====================================
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Tạo sản phẩm mới (Hỗ trợ Upload Ảnh & Variants)' })
  @ApiConsumes('multipart/form-data') // 🌟 Báo cho Swagger biết API này nhận File
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },     // Nhận 1 ảnh làm đại diện
    { name: 'gallery', maxCount: 10 },      // Nhận tối đa 10 ảnh kèm theo
  ]))
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[], gallery?: Express.Multer.File[] }
  ) {
    // Trích xuất file từ object files của Multer
    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;
    const galleryFiles = files.gallery || [];

    const data = await this.productsService.createProduct(createProductDto, thumbnailFile, galleryFiles);
    
    return {
      status: 201,
      message: 'Tạo sản phẩm thành công',
      data: ProductResponseDto.fromEntity(data),
    };
  }

  // =====================================
  // 2. LẤY DANH SÁCH SẢN PHẨM (PHÂN TRANG & TÌM KIẾM)
  // =====================================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm (Có phân trang & Lọc)' })
  @ApiQuery({ name: 'keyword', required: false, description: 'Tìm theo Tên sản phẩm' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Trang hiện tại (Mặc định: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Số item trên 1 trang (Mặc định: 10)' })
  @ApiQuery({ name: 'isPopular', required: false, type: Boolean, description: 'Lọc sản phẩm nổi bật' })
  async findAll(
    @Query() query: any,
  ) {
    const data = await this.productsService.getProducts(query);
    
    return {
      status: 200,
      message: 'Lấy danh sách sản phẩm thành công',
      data: {
        ...data,
        items: ProductResponseDto.fromEntities(data.items),
      },
    };
  }

  // =====================================
  // 3. LẤY DANH SÁCH SẢN PHẨM MỚI (NEW ARRIVALS)
  // =====================================
  @Get('arrivals')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm mới nhất (Có phân trang & Lọc)' })
  async getArrivals(@Query() query: any) {
    const data = await this.productsService.getNewArrivals(query);
    return {
      status: 200,
      message: 'Lấy sản phẩm mới nhất thành công',
      data: {
        ...data,
        items: ProductResponseDto.fromEntities(data.items),
      },
    };
  }

  // =====================================
  // 3.1. LẤY DANH SÁCH SẢN PHẨM HOẠT ĐỘNG (DÀNH CHO NGƯỜI DÙNG)
  // =====================================
  @Get('active')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách tất cả sản phẩm đang hoạt động' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'keyword', required: false, type: String })
  @ApiQuery({ name: 'brandId', required: false, type: Number })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  @ApiQuery({ name: 'priceMin', required: false, type: Number })
  @ApiQuery({ name: 'priceMax', required: false, type: Number })
  @ApiQuery({ name: 'inStock', required: false, type: Boolean })
  async getActiveList(@Query() query: any) {
    const data = await this.productsService.getActiveProducts(query);
    return {
      status: 200,
      message: 'Lấy danh sách sản phẩm hoạt động thành công',
      data: {
        ...data,
        items: ProductResponseDto.fromEntities(data.items),
      },
    };
  }

  // =====================================
  // 3.2. LẤY DANH SÁCH SẢN PHẨM BÁN CHẠY (BÁN ĐƯỢC >= 2)
  // =====================================
  @Get('best-sellers')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm bán chạy (số lượng bán >= 2)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getBestSellersList(@Query() query: any) {
    const data = await this.productsService.getBestSellers(query);
    return {
      status: 200,
      message: 'Lấy danh sách sản phẩm bán chạy thành công',
      data: {
        ...data,
        items: ProductResponseDto.fromEntities(data.items),
      },
    };
  }

  // =====================================
  // 3.3. LẤY DANH SÁCH SẢN PHẨM THEO DANH MỤC CHA (LEVEL = 0/1)
  // =====================================
  @Get('category/parent/:parentId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm theo danh mục cha và các danh mục con trực thuộc' })
  @ApiParam({ name: 'parentId', type: Number, description: 'ID của danh mục cha' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getByParentCategory(
    @Param('parentId', ParseIntPipe) parentId: number,
    @Query() query: any,
  ) {
    const data = await this.productsService.getProductsByParentCategory(parentId, query);
    return {
      status: 200,
      message: 'Lấy danh sách sản phẩm theo danh mục cha thành công',
      data: {
        ...data,
        items: ProductResponseDto.fromEntities(data.items),
      },
    };
  }

  // =====================================
  // 3.4. LẤY DANH SÁCH SẢN PHẨM ĐANG GIẢM GIÁ (PRICE < ORIGINAL_PRICE)
  // =====================================
  @Get('discounted')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm đang giảm giá (Giá bán < Giá gốc)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getDiscountedList(@Query() query: any) {
    const data = await this.productsService.getDiscountedProducts(query);
    return {
      status: 200,
      message: 'Lấy danh sách sản phẩm giảm giá thành công',
      data: {
        ...data,
        items: ProductResponseDto.fromEntities(data.items),
      },
    };
  }

  // =====================================
  // 4. LẤY CHI TIẾT 1 SẢN PHẨM
  // =====================================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lấy chi tiết 1 sản phẩm theo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID của sản phẩm' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.productsService.getProductById(id);
    
    return {
      status: 200,
      message: 'Lấy chi tiết sản phẩm thành công',
      data: ProductResponseDto.fromEntity(data),
    };
  }

  // =====================================
  // 4. CẬP NHẬT SẢN PHẨM (KÈM UPLOAD ẢNH & DỌN RÁC)
  // =====================================
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật toàn bộ thông tin sản phẩm (Ghi đè)' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', type: Number })
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ]))
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateProductDto: CreateProductDto,
    @UploadedFiles() files: { thumbnail?: Express.Multer.File[], gallery?: Express.Multer.File[] }
  ) {
    const thumbnailFile = files.thumbnail ? files.thumbnail[0] : null;
    const galleryFiles = files.gallery || [];

    const data = await this.productsService.updateProduct(id, updateProductDto, thumbnailFile, galleryFiles);
    
    return {
      status: 200,
      message: 'Cập nhật sản phẩm thành công',
      data: ProductResponseDto.fromEntity(data),
    };
  }

  // =====================================
  // 5. XÓA SẢN PHẨM
  // =====================================
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa sản phẩm (Kéo theo xóa Ảnh trên Cloudinary & Biến thể)' })
  @ApiParam({ name: 'id', type: Number })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.productsService.deleteProduct(id);
    
    return {
      status: 200,
      ...data,
    };
  }
}