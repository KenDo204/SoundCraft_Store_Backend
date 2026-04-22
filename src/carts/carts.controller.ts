import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './carts.service';
import { UpsertCartItemDto, BulkDeleteCartItemsDto, UpdateCartItemQuantityDto, UpdateCartItemNoteDto } from './dto/cart.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'; 
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';
import { ApiResponse } from '@nestjs/swagger';
import { CartResponseDto } from './dto/cart.dto';

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy thông tin giỏ hàng (Kèm tính toán tồn kho)' })
  @ApiResponse({ status: 200, type: CartResponseDto }) // 🌟 Gắn vào đây
  async getMyCart(@CurrentUserId() userId: number) {
    const data = await this.cartsService.getCart(userId);
    return {
      status: HttpStatus.OK,
      message: 'Lấy giỏ hàng thành công',
      data,
    };
  }

  @Post('items')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Thêm hoặc cập nhật (Upsert) sản phẩm vào giỏ hàng' })
  async upsertCartItem(
    @CurrentUserId() userId: number, 
    @Body() dto: UpsertCartItemDto
  ) {
    const data = await this.cartsService.upsertCartItem(userId, dto);
    return {
      status: HttpStatus.OK,
      message: 'Đã thêm vào giỏ hàng',
      data,
    };
  }

  @Put('items/:itemId/quantity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật trực tiếp số lượng của item' })
  async updateItemQuantity(
    @CurrentUserId() userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemQuantityDto,
  ) {
    await this.cartsService.updateQuantity(userId, itemId, dto);
    // Sau khi update, gọi lại hàm getCart để trả về giỏ hàng mới nhất (đã check tồn kho)
    const data = await this.cartsService.getCart(userId);
    return {
      status: HttpStatus.OK,
      message: 'Cập nhật số lượng thành công',
      data,
    };
  }

  @Put('items/:itemId/note')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cập nhật ghi chú của item' })
  async updateItemNote(
    @CurrentUserId() userId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() dto: UpdateCartItemNoteDto,
  ) {
    await this.cartsService.updateNote(userId, itemId, dto);
    const data = await this.cartsService.getCart(userId);
    return {
      status: HttpStatus.OK,
      message: 'Cập nhật ghi chú thành công',
      data,
    };
  }

  @Delete('items/bulk-delete')
  @HttpCode(HttpStatus.OK) // Đổi từ NO_CONTENT (204) sang OK (200) để FE nhận được JSON message
  @ApiOperation({ summary: 'Xóa nhiều sản phẩm một lúc' })
  async deleteSelectedItems(
    @CurrentUserId() userId: number, 
    @Body() dto: BulkDeleteCartItemsDto
  ) {
    await this.cartsService.removeItems(userId, dto);
    return {
      status: HttpStatus.OK,
      message: 'Đã xóa các sản phẩm được chọn khỏi giỏ hàng',
    };
  }

  @Delete('items/:itemId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Xóa 1 sản phẩm khỏi giỏ' })
  async deleteItem(
    @CurrentUserId() userId: number, 
    @Param('itemId', ParseIntPipe) itemId: number
  ) {
    // Tái sử dụng logic Bulk Delete bằng cách bọc vào mảng
    await this.cartsService.removeItems(userId, { cartItemIds: [itemId] });
    return {
      status: HttpStatus.OK,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
    };
  }

  @Delete('clear')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Dọn sạch giỏ hàng' })
  async clearCart(@CurrentUserId() userId: number) {
    await this.cartsService.clearCart(userId); 
    return {
      status: HttpStatus.OK,
      message: 'Giỏ hàng đã được làm trống',
    };
  }
}
