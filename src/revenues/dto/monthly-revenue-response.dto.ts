import { ApiProperty } from '@nestjs/swagger';

export class MonthlyRevenueResponseDto {
  @ApiProperty({ example: 1 })
  month: number;

  @ApiProperty({ example: 15000000.00 })
  revenue: number;
}
