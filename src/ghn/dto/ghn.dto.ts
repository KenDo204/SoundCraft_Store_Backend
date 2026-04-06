import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Expose } from 'class-transformer';

// --- REQUEST DTOs ---

export class ShippingFeeRequestDto {
  @ApiProperty({ description: 'ID Quận/Huyện gửi hàng' })
  @IsInt()
  @IsNotEmpty()
  fromDistrictId: number;

  @ApiProperty({ description: 'ID Quận/Huyện nhận hàng' })
  @IsInt()
  @IsNotEmpty()
  toDistrictId: number;

  @ApiProperty({ description: 'Mã Phường/Xã nhận hàng' })
  @IsString()
  @IsNotEmpty()
  toWardCode: string;

  @ApiProperty({ description: 'Trọng lượng gói hàng (gram)' })
  @IsInt()
  @Min(1)
  weight: number;

  @ApiPropertyOptional({ description: 'Chiều dài (cm)' })
  @IsInt()
  @IsOptional()
  length?: number;

  @ApiPropertyOptional({ description: 'Chiều rộng (cm)' })
  @IsInt()
  @IsOptional()
  width?: number;

  @ApiPropertyOptional({ description: 'Chiều cao (cm)' })
  @IsInt()
  @IsOptional()
  height?: number;

  @ApiPropertyOptional({ description: 'Giá trị hàng hóa để tính bảo hiểm (VNĐ)' })
  @IsInt()
  @IsOptional()
  insuranceValue?: number;
}

// --- GHN RESPONSE DTOs (Sử dụng class-transformer để map snake_case từ GHN) ---

export class GhnProvinceDto {
  @Expose({ name: 'ProvinceID' })
  provinceId: number;

  @Expose({ name: 'ProvinceName' })
  provinceName: string;
}

export class GhnDistrictDto {
  @Expose({ name: 'DistrictID' })
  districtId: number;

  @Expose({ name: 'ProvinceID' })
  provinceId: number;

  @Expose({ name: 'DistrictName' })
  districtName: string;
}

export class GhnWardDto {
  @Expose({ name: 'WardCode' })
  wardCode: string;

  @Expose({ name: 'DistrictID' })
  districtId: number;

  @Expose({ name: 'WardName' })
  wardName: string;
}

export class AvailableServiceDto {
  @Expose({ name: 'service_id' })
  serviceId: number;

  @Expose({ name: 'short_name' })
  serviceName: string;

  @Expose({ name: 'service_type_id' })
  serviceTypeId: number;
}

export class ShippingFeeResponseDto {
  totalFee: number;
  serviceFee: number;
  insuranceFee: number;
  serviceId: number;
  serviceName: string;
  expectedDeliveryTime?: string;
  availableServices: AvailableServiceDto[];
}