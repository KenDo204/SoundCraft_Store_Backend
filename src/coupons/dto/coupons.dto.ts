import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsNumber, Min, IsDateString, IsOptional, Matches, IsArray } from 'class-validator';
import { DiscountType } from '../enums/coupon-discount.enum';

export class CreateCouponDto {
  @ApiProperty({ example: 'SUMMER2026' })
  @IsString()
  @Matches(/^[A-Z0-9]+$/, { message: 'Mã giảm giá chỉ được chứa chữ cái in hoa và số, không khoảng trắng' })
  code: string;

  @ApiProperty({ enum: DiscountType })
  @IsEnum(DiscountType)
  discountType: DiscountType;

  @ApiProperty({ example: 50000 })
  @IsNumber()
  @Min(1)
  discountValue: number;

  @ApiProperty({ example: 200000 })
  @IsNumber()
  @Min(0)
  minOrderAmount: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Min(1)
  maxUsage: number;

  @ApiProperty({ example: '2026-05-01T00:00:00Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-05-30T23:59:59Z' })
  @IsDateString()
  endDate: string;
}

export class ApplyCouponPreviewDto {
  @ApiProperty({ example: 1500000, description: 'Tổng tiền giỏ hàng hiện tại' })
  @IsNumber()
  @Min(1)
  totalCartAmount: number;

  @ApiProperty({ example: 'SUMMER2026' })
  @IsString()
  couponCode: string;
}

export class CommitCouponUsageDto {
  @ApiProperty({ example: 999 })
  @IsNumber()
  orderId: number;

  @ApiProperty({ example: ['SUMMER2026'] })
  @IsArray()
  @IsString({ each: true })
  couponCodes: string[];
}