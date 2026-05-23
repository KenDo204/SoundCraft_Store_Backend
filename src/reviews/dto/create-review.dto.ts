import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @ApiProperty({ example: 1, description: 'ID của sản phẩm' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  product_id: number;

  @ApiProperty({ example: 1, description: 'ID của đơn hàng', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  order_id?: number;

  @ApiProperty({ example: 5, description: 'Đánh giá từ 1 đến 5 sao' })
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ example: 'Sản phẩm tuyệt vời!', description: 'Nội dung đánh giá', required: false })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' }, description: 'Danh sách tệp hình ảnh', required: false })
  @IsOptional()
  images?: any[];
}
