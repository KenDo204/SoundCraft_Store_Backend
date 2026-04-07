import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TrackingService } from './tracking.service';
import { TrackingBehaviorBatchDto } from './dto/tracking.dto';

@ApiTags('Tracking')
@Controller('tracking/behaviors')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  @Post('batch')
  @HttpCode(HttpStatus.ACCEPTED) // Trả về 202 Accepted
  @ApiOperation({ summary: 'Ghi log hành vi người dùng theo lô (Bất đồng bộ)' })
  @ApiResponse({ status: 202, description: 'Đã tiếp nhận batch tracking' })
  ingestBatch(@Body() request: TrackingBehaviorBatchDto) {
    // Kích hoạt hàm xử lý nhưng CỐ TÌNH KHÔNG DÙNG "await".
    // Nhờ đó vòng đời Request-Response kết thúc ngay lập tức.
    // Việc lưu DB sẽ tự động chạy ngầm trong background của Node.js Event Loop.
    this.trackingService.enqueueBatch(request);

    return {
      status: 202,
      message: 'Đã tiếp nhận batch tracking để xử lý bất đồng bộ',
    };
  }
}