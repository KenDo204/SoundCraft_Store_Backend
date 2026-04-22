import { Controller, Get, Post, Body, Param, Delete, UseGuards, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { WishlistsService } from './wishlists.service';
import { ToggleWishlistDto } from './dto/toggle-wishlist.dto';
import { WishlistStatusResponseDto } from './dto/wishlist-status-response.dto';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';

@ApiTags('Wishlists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) { }

  @Post('toggle')
  @ApiOperation({ summary: 'Thêm hoặc xóa sản phẩm khỏi danh sách yêu thích (Toggle)' })
  @ApiResponse({ type: WishlistStatusResponseDto })
  toggle(@CurrentUserId() userId: number, @Body() dto: ToggleWishlistDto): Promise<WishlistStatusResponseDto> {
    return this.wishlistsService.toggleWishlist(userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Lấy danh sách yêu thích của người dùng hiện tại' })
  findMyWishlist(@CurrentUserId() userId: number, @Query() query: any) {
    return this.wishlistsService.getMyWishlist(userId, query);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: 'Kiểm tra trạng thái yêu thích của một sản phẩm' })
  @ApiResponse({ type: WishlistStatusResponseDto })
  checkStatus(
    @CurrentUserId() userId: number,
    @Param('productId', ParseIntPipe) productId: number
  ): Promise<WishlistStatusResponseDto> {
    return this.wishlistsService.checkInWishlist(userId, productId);
  }

  @Delete(':productId')
  @ApiOperation({ summary: 'Xóa một sản phẩm cụ thể khỏi danh sách yêu thích' })
  remove(
    @CurrentUserId() userId: number,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    return this.wishlistsService.removeFromWishlist(userId, productId);
  }
}
