import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, ParseIntPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { RolesGuard } from '@/auth/guards/roles.guard'; // Đảm bảo đường dẫn này đúng
import { Roles } from '@/auth/decorators/roles.decorator';

@ApiTags('Brands - Quản lý thương hiệu')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) { }

  // ==========================================
  // PUBLIC APIs (Khách hàng xem)
  // ==========================================

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả thương hiệu' })
  async getAllBrands() {
    const brands = await this.brandsService.findAll();
    return { status: 200, message: 'Lấy danh sách thương hiệu thành công', data: brands };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết một thương hiệu theo ID' })
  async getBrandById(@Param('id', ParseIntPipe) id: number) {
    const brand = await this.brandsService.findOne(id);
    return { status: 200, message: 'Lấy thông tin thương hiệu thành công', data: brand };
  }

  // ==========================================
  // ADMIN APIs (Yêu cầu Quyền SUPER_ADMIN)
  // ==========================================

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Tạo thương hiệu mới (Yêu cầu quyền Super Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createBrand(
    @Body() createBrandDto: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const brand = await this.brandsService.create(createBrandDto, file);
    return { status: 201, message: 'Tạo thương hiệu thành công', data: brand };
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Cập nhật thông tin thương hiệu (Yêu cầu quyền Super Admin)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateBrand(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBrandDto: UpdateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const brand = await this.brandsService.update(id, updateBrandDto, file);
    return { status: 200, message: 'Cập nhật thương hiệu thành công', data: brand };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa thương hiệu (Yêu cầu quyền Super Admin)' })
  async deleteBrand(@Param('id', ParseIntPipe) id: number) {
    await this.brandsService.remove(id);
    // Xóa thành công không cần trả data
    return { status: 200, message: 'Xóa thương hiệu thành công' };
  }
}