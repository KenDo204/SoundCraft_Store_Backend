import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CartService } from './carts.service';
import { UpsertCartItemDto, BulkDeleteCartItemsDto, UpdateCartItemQuantityDto, UpdateCartItemNoteDto } from './dto/cart.dto';
// Giả định bạn có JwtAuthGuard
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard'; 

@ApiTags('Carts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartService) {}

  // @Get('my-cart')
  // @ApiOperation({ summary: 'Lấy thông tin giỏ hàng của người dùng hiện tại' })
  // async getMyCart(@Request() req) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   return this.cartsService.getMyCart(userId);
  // }

  // @Post('items')
  // @ApiOperation({ summary: 'Thêm hoặc cập nhật (Upsert) sản phẩm vào giỏ hàng' })
  // async upsertCartItem(@Request() req, @Body() dto: UpsertCartItemDto) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   return this.cartsService.upsertCartItem(userId, dto);
  // }

  // @Put('items/:itemId/quantity')
  // @ApiOperation({ summary: 'Cập nhật trực tiếp số lượng của item' })
  // async updateItemQuantity(
  //   @Request() req,
  //   @Param('itemId', ParseIntPipe) itemId: number,
  //   @Body() dto: UpdateCartItemQuantityDto,
  // ) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   await this.cartsService.updateItemQuantity(userId, itemId, dto.quantity);
  //   return this.cartsService.getMyCart(userId);
  // }

  // @Put('items/:itemId/note')
  // @ApiOperation({ summary: 'Cập nhật ghi chú của item' })
  // async updateItemNote(
  //   @Request() req,
  //   @Param('itemId', ParseIntPipe) itemId: number,
  //   @Body() dto: UpdateCartItemNoteDto,
  // ) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   await this.cartsService.updateItemNote(userId, itemId, dto.note);
  //   return this.cartsService.getMyCart(userId);
  // }

  // @Delete('items/bulk-delete')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'Xóa nhiều sản phẩm một lúc' })
  // async deleteSelectedItems(@Request() req, @Body() dto: BulkDeleteCartItemsDto) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   await this.cartsService.removeCartItems(userId, dto);
  // }

  // @Delete('items/:itemId')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'Xóa 1 sản phẩm khỏi giỏ' })
  // async deleteItem(@Request() req, @Param('itemId', ParseIntPipe) itemId: number) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   await this.cartsService.removeCartItems(userId, { cartItemIds: [itemId] });
  // }

  // @Delete('clear')
  // @HttpCode(HttpStatus.NO_CONTENT)
  // @ApiOperation({ summary: 'Dọn sạch giỏ hàng' })
  // async clearCart(@Request() req) {
  //   const userId = Number(req.user.user_id || req.user.id);
  //   await this.cartsService.clearCart(userId);
  // }
}
