import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReviewDto {
  @ApiProperty({ example: 5, description: 'Đánh giá từ 1 đến 5 sao', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({ example: 'Sản phẩm tuyệt vời!', description: 'Nội dung đánh giá', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Danh sách tệp hình ảnh mới', required: false })
  @IsOptional()
  images?: any[];
}
