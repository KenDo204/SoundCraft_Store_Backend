import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  UseGuards, 
  Query, 
  UseInterceptors, 
  UploadedFiles 
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@/users/enums/user-role.enum';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // --- Endpoints cho Người dùng ---

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Người dùng gửi đánh giá sản phẩm (bao gồm upload ảnh)' })
  async create(
    @CurrentUserId() userId: number, 
    @Body() createReviewDto: CreateReviewDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.reviewsService.create(userId, createReviewDto, files);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 5))
  @ApiOperation({ summary: 'Người dùng chỉnh sửa đánh giá (bao gồm upload ảnh mới)' })
  async update(
    @CurrentUserId() userId: number,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    return this.reviewsService.update(userId, +id, updateReviewDto, files);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Người dùng xóa đánh giá' })
  async remove(@CurrentUserId() userId: number, @Param('id') id: string) {
    return this.reviewsService.removeByUser(userId, +id);
  }

  // --- Endpoints cho Quản trị viên ---

  @Patch(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin duyệt đánh giá (Chờ duyệt -> Đã duyệt)' })
  async approve(@Param('id') id: string) {
    return this.reviewsService.approve(+id);
  }

  @Patch(':id/hide')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin ẩn đánh giá' })
  async hide(@Param('id') id: string) {
    return this.reviewsService.hide(+id);
  }

  @Delete(':id/admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin xóa vĩnh viễn đánh giá' })
  async removeByAdmin(@Param('id') id: string) {
    return this.reviewsService.removeByAdmin(+id);
  }

  @Get('admin/list')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin lấy danh sách đánh giá có lọc' })
  async findAllAdmin(@Query() query: ReviewQueryDto) {
    return this.reviewsService.findAll(query);
  }

  @Get('statistics/:productId')
  @ApiOperation({ summary: 'Lấy thống kê đánh giá theo sản phẩm' })
  async getStatistics(@Param('productId') productId: string) {
    return this.reviewsService.getStatisticsByProduct(+productId);
  }

  // --- Public Endpoints ---

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách đánh giá công khai của sản phẩm' })
  async findAll(@Query() query: ReviewQueryDto) {
    // Luôn chỉ hiện các đánh giá đã duyệt khi gọi public
    query.status = 'PUBLISHED';
    return this.reviewsService.findAll(query);
  }

}
