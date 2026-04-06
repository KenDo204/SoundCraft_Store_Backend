import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { SlidersService } from './sliders.service';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';

@ApiTags('Sliders - Quản lý Banner Quảng Cáo')
@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) { }

  // ==========================================
  // PUBLIC API 
  // ==========================================
  @Get('active')
  @ApiOperation({ summary: 'Lấy danh sách Banner đang hoạt động (Cho Khách hàng)' })
  async getActiveSliders() {
    const sliders = await this.slidersService.getActiveSliders();
    return { status: 200, message: 'Lấy danh sách slider thành công', data: sliders };
  }

  // ==========================================
  // ADMIN APIs
  // ==========================================
  @Get('admin')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Lấy tất cả Banner (Cho Admin)' })
  async getAllSlidersForAdmin() {
    const sliders = await this.slidersService.getAllSlidersForAdmin();
    return { status: 200, message: 'Lấy danh sách slider thành công', data: sliders };
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  async getSliderById(@Param('id') id: string) {
    const slider = await this.slidersService.getSliderById(+id);
    return { status: 200, message: 'Lấy thông tin slider thành công', data: slider };
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Tạo Banner mới' })
  async createSlider(
    @Body() createSliderDto: CreateSliderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const slider = await this.slidersService.create(createSliderDto, file);
    return { status: 201, message: 'Tạo slider thành công', data: slider };
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Cập nhật Banner' })
  async updateSlider(
    @Param('id') id: string,
    @Body() updateSliderDto: UpdateSliderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const slider = await this.slidersService.update(+id, updateSliderDto, file);
    return { status: 200, message: 'Cập nhật slider thành công', data: slider };
  }

  @Patch(':id/toggle') // Giống hệt @PatchMapping("/{id}/toggle") bên Java
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Đổi trạng thái Bật/Tắt Banner' })
  async toggleSliderStatus(@Param('id') id: string) {
    const slider = await this.slidersService.toggleStatus(+id);
    return { status: 200, message: 'Đổi trạng thái slider thành công', data: slider };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ROLE_SUPER_ADMIN')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Xóa Banner' })
  async deleteSlider(@Param('id') id: string) {
    await this.slidersService.remove(+id);
    return { status: 200, message: 'Xóa slider thành công' };
  }
}