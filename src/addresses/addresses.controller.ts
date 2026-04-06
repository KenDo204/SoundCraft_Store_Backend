import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressService } from './addresses.service';
import { AddressRequestDto } from './dto/address.dto';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'; 

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy tất cả địa chỉ của user' })
  async getMyAddresses(@CurrentUserId() userId: number) {
    return {
      message: 'Lấy danh sách địa chỉ thành công',
      data: await this.addressService.getMyAddresses(userId),
    };
  }

  @Get('default')
  @ApiOperation({ summary: 'Lấy địa chỉ mặc định' })
  async getDefaultAddress(@CurrentUserId() userId: number) {
    return {
      message: 'Lấy địa chỉ mặc định thành công',
      data: await this.addressService.getDefaultAddress(userId),
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một địa chỉ theo ID' })
  async getAddressById(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return {
      message: 'Lấy thông tin địa chỉ thành công',
      data: await this.addressService.getAddressById(userId, id),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Tạo địa chỉ mới' })
  async createAddress(@CurrentUserId() userId: number, @Body() dto: AddressRequestDto) {
    return {
      message: 'Tạo địa chỉ thành công',
      data: await this.addressService.createAddress(userId, dto),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ' })
  async updateAddress(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddressRequestDto,
  ) {
    return {
      message: 'Cập nhật địa chỉ thành công',
      data: await this.addressService.updateAddress(userId, id, dto),
    };
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Đặt làm địa chỉ mặc định' })
  async setDefaultAddress(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    return {
      message: 'Đặt địa chỉ mặc định thành công',
      data: await this.addressService.setDefaultAddress(userId, id),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa địa chỉ' })
  async deleteAddress(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    await this.addressService.deleteAddress(userId, id);
    return {
      message: 'Xóa địa chỉ thành công',
    };
  }
}