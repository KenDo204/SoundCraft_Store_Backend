import { ApiProperty } from '@nestjs/swagger';

export class OrdersByStatusDto {
  @ApiProperty({ example: 10 })
  PENDING: number;

  @ApiProperty({ example: 5 })
  SHIPPING: number;

  @ApiProperty({ example: 100 })
  DELIVERED: number;

  @ApiProperty({ example: 5 })
  CANCELLED: number;
}

export class DashboardStatsResponseDto {
  @ApiProperty({ example: 150 })
  totalProducts: number;

  @ApiProperty({ example: 10 })
  totalCategories: number;

  @ApiProperty({ example: 500 })
  totalCustomers: number;

  @ApiProperty({ example: 120 })
  totalOrders: number;

  @ApiProperty({ type: OrdersByStatusDto })
  ordersByStatus: OrdersByStatusDto;

  @ApiProperty({ example: 250000000.00 })
  totalRevenue: number;
}
