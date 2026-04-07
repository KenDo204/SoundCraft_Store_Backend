import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class SuggestionQueryDto {
  @ApiPropertyOptional({ description: 'Từ khóa gợi ý' })
  @IsOptional()
  @IsString()
  q?: string;
}

export class ProductSearchDto {
  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'ID danh mục' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Giá thấp nhất' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Giá cao nhất' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Trang hiện tại (Mặc định: 1)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Số lượng / trang (Mặc định: 20)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  size?: number = 20;

  @ApiPropertyOptional({ description: 'Sắp xếp (price_asc, price_desc, latest)' })
  @IsOptional()
  @IsString()
  @IsIn(['price_asc', 'price_desc', 'latest'])
  sort?: string = 'latest';
}