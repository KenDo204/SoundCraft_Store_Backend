import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsBoolean, IsOptional, Matches, Length, IsNumber } from 'class-validator';

export class AddressRequestDto {
  @ApiProperty({ description: 'Tên người nhận' })
  @IsNotEmpty({ message: 'Tên người nhận không được để trống' })
  @Length(2, 100, { message: 'Tên người nhận phải từ 2-100 ký tự' })
  recipientName: string;

  @ApiProperty({ description: 'Số điện thoại' })
  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @Matches(/^(\+84|0)[35789][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  phone: string;

  @ApiProperty({ description: 'ID Tỉnh/Thành phố' })
  @IsInt({ message: 'Tỉnh/Thành phố không hợp lệ' })
  provinceId: number;

  @ApiProperty({ description: 'ID Quận/Huyện' })
  @IsInt({ message: 'Quận/Huyện không hợp lệ' })
  districtId: number;

  @ApiProperty({ description: 'Mã Phường/Xã' })
  @IsString({ message: 'Phường/Xã không hợp lệ' })
  @IsNotEmpty()
  wardCode: string;

  @ApiProperty({ description: 'Số nhà, tên đường (Địa chỉ chi tiết)' })
  @IsNotEmpty({ message: 'Địa chỉ chi tiết không được để trống' })
  @Length(5, 255, { message: 'Địa chỉ chi tiết phải từ 5-255 ký tự' })
  addressDetail: string;

  @ApiPropertyOptional({ description: 'Đặt làm mặc định' })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Ghi chú cho tài xế giao đồ ăn' })
  @IsOptional()
  @IsString()
  addressNote?: string;
}