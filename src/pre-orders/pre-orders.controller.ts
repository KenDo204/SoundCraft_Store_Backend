import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe } from '@nestjs/common';
import { PreOrdersService } from './pre-orders.service';
import { CreatePreOrderDto } from './dto/create-pre-order.dto';
import { UpdatePreOrderDto } from './dto/update-pre-order.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUserId } from '@/auth/decorators/current-user.decorator';

@ApiTags('Pre-Orders')
@Controller('pre-orders')
export class PreOrdersController {
  constructor(private readonly preOrdersService: PreOrdersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Đăng ký nhận thông báo khi có hàng' })
  @Post()
  create(@CurrentUserId() userId: number, @Body() createPreOrderDto: CreatePreOrderDto) {
    return this.preOrdersService.create(userId, createPreOrderDto);
  }

  @ApiOperation({ summary: 'Lấy tất cả danh sách đăng ký nhận thông báo' })
  @Get()
  findAll() {
    return this.preOrdersService.findAll();
  }

  @ApiOperation({ summary: 'Lấy chi tiết một đăng ký' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.preOrdersService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cập nhật trạng thái đăng ký' })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePreOrderDto: UpdatePreOrderDto) {
    return this.preOrdersService.update(id, updatePreOrderDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Xóa đăng ký' })
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.preOrdersService.remove(id);
  }
}
