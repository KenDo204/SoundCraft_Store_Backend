import { Controller, Post, Body, Req, UseGuards, Param, ParseIntPipe, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CheckoutRequestDto } from './dto/checkout-request.dto';
import { CheckoutResponseDto } from './dto/checkout-response.dto';
import { CancelOrderDto } from './dto/cancel-order.dto';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UpdateOrderStatusDto, UpdateOrderItemsDto } from './dto/update-order-admin.dto';
import { OrderResponse } from './dto/order-response.dto';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Thực hiện Đặt hàng (Checkout) các sản phẩm đã chọn' })
  @ApiResponse({ type: CheckoutResponseDto })
  async checkout(
    @CurrentUserId() userId: number,
    @Req() req: any, 
    @Body() request: CheckoutRequestDto
  ): Promise<any> {
    const ipAddress = req.ip; // Dùng cho VNPAY
    const data = await this.ordersService.checkout(userId, request, ipAddress);
    return {
      status: 201,
      message: 'Đặt hàng thành công',
      data
    };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Khách hàng yêu cầu hủy đơn hàng' })
  async cancelOrder(
    @CurrentUserId() userId: number,
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: CancelOrderDto
  ) {
    await this.ordersService.cancelOrderByBuyer(userId, orderId, dto.reason);
    return { 
      status: 200,
      message: 'Hủy đơn hàng thành công' 
    };
  }

  @Get('vnpay/ipn')
  @ApiOperation({ summary: 'Webhook/IPN từ VNPAY báo cáo kết quả thanh toán' })
  async vnpayIpn(@Query() query: any) {
    return await this.ordersService.handleVnpayCallback(query);
  }

  // --- ADMIN ENDPOINTS --- //

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy tất cả list order dành riêng cho Admin' })
  @ApiResponse({ type: [OrderResponse] })
  async getAllOrdersAdmin() {
    const data = await this.ordersService.getAllOrdersAdmin();
    return {
      status: 200,
      message: 'Lấy danh sách đơn hàng thành công',
      data
    };
  }

  @Post('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin thay đổi status (PENDING, SHIPPING, DELIVERED, CANCELLED)' })
  async updateOrderStatus(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderStatusDto
  ) {
    const data = await this.ordersService.updateOrderStatus(orderId, dto.status);
    return { 
      status: 200,
      message: 'Đã cập nhật trạng thái đơn hàng',
      data
    };
  }

  @Post('admin/:id/items')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ROLE_SUPER_ADMIN', 'ROLE_OWNER', 'ROLE_ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin thay đổi món hàng bên trong đơn hàng khi khách có yêu cầu' })
  async updateOrderItems(
    @Param('id', ParseIntPipe) orderId: number,
    @Body() dto: UpdateOrderItemsDto
  ) {
    const data = await this.ordersService.updateOrderItems(orderId, dto.items);
    return { 
      status: 200,
      message: 'Đã cập nhật sản phẩm trong đơn',
      data
    };
  }

  // --- CUSTOMER ENDPOINTS --- //

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lấy danh sách đơn hàng của User đang đăng nhập' })
  @ApiResponse({ type: [OrderResponse] })
  async getOrdersByCurrentUser(@CurrentUserId() userId: number) {
    const data = await this.ordersService.getOrdersByCurrentUser(userId);
    return {
      status: 200,
      message: 'Lấy đơn hàng của tôi thành công',
      data
    };
  }
}
