import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'; 
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';
import { ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ================= PUBLIC API (Cho User) =================
  
  @Get()
  async getPublishedBlogs(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10
  ) {
    return await this.blogsService.getPublishedBlogs(page, limit);
  }

  // ================= ADMIN API (Yêu cầu quyền) =================
  // ⚠️ QUAN TRỌNG: Các route admin PHẢI đặt TRƯỚC route :slug
  // Nếu không, NestJS sẽ hiểu "admin" là một slug và match nhầm

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Get('admin')
  @ApiOperation({ summary: 'Lấy danh sách tất cả blog cho Admin (Có phân trang)' })
  async getAllAdminBlogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.blogsService.getAllAdminBlogs(page, limit);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Get('admin/:id')
  @ApiOperation({ summary: 'Lấy chi tiết 1 blog theo ID cho Admin để Edit' })
  async getAdminBlogById(@Param('id') id: number) {
    return await this.blogsService.getAdminBlogById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Post('admin')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async createBlog(
    @CurrentUserId() userId: number,
    @Body() dto: CreateBlogDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return await this.blogsService.createBlog(userId, dto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Put('admin/:id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async updateBlog(
    @Param('id') id: number,
    @Body() dto: UpdateBlogDto,
    @UploadedFile() file?: Express.Multer.File
  ) {
    return await this.blogsService.updateBlog(id, dto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Put('admin/:id/publish')
  async publishBlog(@Param('id') id: number) {
    return await this.blogsService.changeStatus(id, 'PUBLISHED');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Put('admin/:id/hide')
  async hideBlog(@Param('id') id: number) {
    return await this.blogsService.changeStatus(id, 'HIDDEN');
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_OWNER')
  @Delete('admin/:id')
  async deleteBlog(@Param('id') id: number) {
    return await this.blogsService.deleteBlog(id);
  }

  // ================= PUBLIC: Dynamic slug route (PHẢI ĐẶT CUỐI CÙNG) =================

  @Get(':slug')
  async getBlogBySlug(@Param('slug') slug: string) {
    return await this.blogsService.getBlogBySlug(slug);
  }
}