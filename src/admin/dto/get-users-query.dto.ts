import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsBooleanString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class GetUsersQueryDto {
  @ApiPropertyOptional({ description: 'Tìm kiếm theo Tên, Email hoặc Số điện thoại' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái hoạt động (true/false)' })
  @IsOptional()
  @IsBooleanString() // Nhận giá trị 'true' hoặc 'false' từ query string
  isActive?: string;

  @ApiPropertyOptional({ description: 'Chi tiêu tối thiểu' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minSpending?: number;

  @ApiPropertyOptional({ description: 'Chi tiêu tối đa' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxSpending?: number;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number) // Parse string từ URL query sang số
  @IsInt()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;
}