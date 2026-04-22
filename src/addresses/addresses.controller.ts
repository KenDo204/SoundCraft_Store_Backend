import { Controller, Get, Post, Put, Patch, Delete, Body, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddressService } from './addresses.service';
import { AddressRequestDto } from './dto/address.dto';
import { AddressResponseDto } from './dto/address-response.dto';
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
    const addresses = await this.addressService.getMyAddresses(userId);
    return {
      status: 200,
      message: 'Lấy danh sách địa chỉ thành công',
      data: AddressResponseDto.fromEntities(addresses),
    };
  }

  @Get('default')
  @ApiOperation({ summary: 'Lấy địa chỉ mặc định' })
  async getDefaultAddress(@CurrentUserId() userId: number) {
    const address = await this.addressService.getDefaultAddress(userId);
    return {
      status: 200,
      message: 'Lấy địa chỉ mặc định thành công',
      data: address ? AddressResponseDto.fromEntity(address) : null,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy thông tin chi tiết một địa chỉ theo ID' })
  async getAddressById(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const address = await this.addressService.getAddressById(userId, id);
    return {
      status: 200,
      message: 'Lấy thông tin địa chỉ thành công',
      data: AddressResponseDto.fromEntity(address),
    };
  }

  @Post()
  @ApiOperation({ summary: 'Tạo địa chỉ mới' })
  async createAddress(@CurrentUserId() userId: number, @Body() dto: AddressRequestDto) {
    const address = await this.addressService.createAddress(userId, dto);
    return {
      status: 201,
      message: 'Tạo địa chỉ thành công',
      data: AddressResponseDto.fromEntity(address),
    };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cập nhật địa chỉ' })
  async updateAddress(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddressRequestDto,
  ) {
    const address = await this.addressService.updateAddress(userId, id, dto);
    return {
      status: 200,
      message: 'Cập nhật địa chỉ thành công',
      data: AddressResponseDto.fromEntity(address),
    };
  }

  @Patch(':id/set-default')
  @ApiOperation({ summary: 'Đặt làm địa chỉ mặc định' })
  async setDefaultAddress(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    const address = await this.addressService.setDefaultAddress(userId, id);
    return {
      status: 200,
      message: 'Đặt địa chỉ mặc định thành công',
      data: AddressResponseDto.fromEntity(address),
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa địa chỉ' })
  async deleteAddress(@CurrentUserId() userId: number, @Param('id', ParseIntPipe) id: number) {
    await this.addressService.deleteAddress(userId, id);
    return {
      status: 200,
      message: 'Xóa địa chỉ thành công',
    };
  }
}