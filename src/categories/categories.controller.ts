import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('Categories - Quản lý Danh mục')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  // ==========================================
  // PUBLIC APIs (Khách hàng)
  // ==========================================

  // Tinh hoa BE 1: Trả về cây thư mục 3 cấp cho FE vẽ Menu
  @Get('tree')
  @ApiOperation({ summary: 'Lấy cây Danh mục (Phục vụ Menu Khách hàng)' })
  @ApiQuery({ name: 'all', required: false, type: Boolean, description: 'Lấy tất cả bao gồm cả ẩn' })
  async getCategoryTree(@Query('all') all?: string) {
    const includeInactive = all === 'true';
    const tree = await this.categoriesService.getCategoryTree(includeInactive);
    return { status: 200, message: 'Lấy cây danh mục thành công', data: tree };
  }

  // ==========================================
  // ADMIN APIs (Yêu cầu Token)
  // ==========================================

  // Tinh hoa BE 2: Cho phép Admin lọc theo keyword và parent_id
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy danh sách Danh mục (Cho Admin quản lý)' })
  @ApiQuery({ name: 'keyword', required: false })
  @ApiQuery({ name: 'parent_id', required: false, type: Number })
  async getAllForAdmin(
    @Query('keyword') keyword?: string,
    @Query('parent_id') parent_id?: number,
  ) {
    const categories = await this.categoriesService.getAllForAdmin(keyword, parent_id);
    return { status: 200, message: 'Lấy danh sách danh mục thành công', data: categories };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 danh mục' })
  async getCategoryById(@Param('id') id: string) {
    const category = await this.categoriesService.getCategoryById(+id);
    return { status: 200, message: 'Lấy chi tiết danh mục thành công', data: category };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Tạo Danh mục mới' })
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const category = await this.categoriesService.create(createCategoryDto, file);
    return { status: 201, message: 'Tạo danh mục thành công', data: category };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cập nhật Danh mục' })
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const category = await this.categoriesService.update(+id, updateCategoryDto, file);
    return { status: 200, message: 'Cập nhật danh mục thành công', data: category };
  }

  // Tinh hoa BE 2: Tách riêng nút Bật/Tắt (Toggle) cho mượt
  @Patch(':id/toggle')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đổi trạng thái Bật/Tắt Danh mục' })
  async toggleStatus(@Param('id') id: string) {
    const category = await this.categoriesService.toggleStatus(+id);
    return { status: 200, message: 'Đổi trạng thái danh mục thành công', data: category };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa Danh mục (Chỉ xóa nếu không có con)' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(+id);
    return { status: 200, message: 'Xóa danh mục thành công' };
  }
}