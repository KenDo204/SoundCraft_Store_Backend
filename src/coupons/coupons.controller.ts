import { Controller, Get, Post, Patch, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { CreateCouponDto, ApplyCouponPreviewDto, CommitCouponUsageDto } from './dto/coupons.dto';

// Lưu ý: Tích hợp AuthGuard và RolesGuard của bạn tại đây
@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  // --- PUBLIC / USER ROUTES ---

  @Post('apply-preview')
  @ApiOperation({ summary: 'Xem trước số tiền được giảm' })
  async applyPreview(@Req() req: any, @Body() dto: ApplyCouponPreviewDto) {
    const userId = req.user.userId; // Trích xuất từ JWT
    const data = await this.couponsService.applyCouponPreview(userId, dto);
    return { status: 200, message: 'Tính toán thành công', data };
  }

  @Post('checkout/commit')
  @ApiOperation({ summary: 'Chốt lượt dùng mã giảm giá sau khi tạo đơn hàng' })
  async commitUsages(@Req() req: any, @Body() dto: CommitCouponUsageDto) {
    const userId = req.user.userId;
    await this.couponsService.commitCouponUsages(userId, dto);
    return { status: 200, message: 'Ghi nhận lượt dùng thành công' };
  }

  // --- ADMIN ROUTES ---

  @Post('admin')
  @ApiOperation({ summary: 'Admin: Tạo mã giảm giá mới' })
  async create(@Body() dto: CreateCouponDto) {
    const data = await this.couponsService.createCoupon(dto);
    return { status: 201, message: 'Tạo mã giảm giá thành công', data };
  }

  @Get('admin')
  @ApiOperation({ summary: 'Admin: Lấy danh sách mã giảm giá' })
  async findAll() {
    const data = await this.couponsService.getAllCoupons();
    return { status: 200, message: 'Thành công', data };
  }

  @Patch('admin/:id/toggle-active')
  @ApiOperation({ summary: 'Admin: Bật/Tắt trạng thái hoạt động' })
  async toggleActive(@Param('id', ParseIntPipe) id: number) {
    const data = await this.couponsService.toggleActive(id);
    return { status: 200, message: 'Cập nhật trạng thái thành công', data };
  }
}