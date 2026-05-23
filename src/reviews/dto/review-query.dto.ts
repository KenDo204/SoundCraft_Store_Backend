import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsNumberString } from 'class-validator';

export class ReviewQueryDto {
  @ApiPropertyOptional({ description: 'Lọc theo số sao' })
  @IsOptional()
  @IsNumberString()
  rating?: string;

  @ApiPropertyOptional({ description: 'Lọc theo trạng thái: PENDING, PUBLISHED, HIDDEN' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Lọc theo product_id' })
  @IsOptional()
  @IsNumberString()
  product_id?: string;

  @ApiPropertyOptional({ description: 'Sắp xếp theo: newest, oldest, highest_rating, lowest_rating' })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
