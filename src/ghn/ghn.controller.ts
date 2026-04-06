import { Controller, Get, Post, Query, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GhnService } from './ghn.service';
import { ShippingFeeRequestDto } from './dto/ghn.dto';

@ApiTags('Giao Hàng Nhanh Integration')
@Controller('ghn')
export class GhnController {
  constructor(private readonly ghnService: GhnService) {}

  @Get('provinces')
  @ApiOperation({ summary: 'Lấy danh sách Tỉnh/Thành phố' })
  async getProvinces() {
    return {
      status: 200,
      message: 'Lấy danh sách tỉnh/thành phố thành công',
      data: await this.ghnService.getProvinces(),
    };
  }

  @Get('districts')
  @ApiOperation({ summary: 'Lấy danh sách Quận/Huyện theo Tỉnh' })
  async getDistricts(@Query('provinceId', ParseIntPipe) provinceId: number) {
    return {
      status: 200,
      message: 'Lấy danh sách quận/huyện thành công',
      data: await this.ghnService.getDistricts(provinceId),
    };
  }

  @Get('wards')
  @ApiOperation({ summary: 'Lấy danh sách Phường/Xã theo Quận/Huyện' })
  async getWards(@Query('districtId', ParseIntPipe) districtId: number) {
    return {
      status: 200,
      message: 'Lấy danh sách phường/xã thành công',
      data: await this.ghnService.getWards(districtId),
    };
  }

  @Post('shipping-fee')
  @ApiOperation({ summary: 'Tính phí vận chuyển cho đơn hàng' })
  async calculateShippingFee(@Body() payload: ShippingFeeRequestDto) {
    return {
      status: 200,
      message: 'Tính phí giao hàng thành công',
      data: await this.ghnService.calculateShippingFee(payload),
    };
  }
}