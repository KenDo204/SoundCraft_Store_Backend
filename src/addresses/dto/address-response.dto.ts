import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../entities/address.entity';

export class AddressResponseDto {
  @ApiProperty({ example: 1 })
  addressId: number;

  @ApiProperty({ example: 'Nguyễn Văn A', description: 'Tên người nhận' })
  recipientName: string;

  @ApiProperty({ example: '0987654321', description: 'Số điện thoại nhận hàng' })
  phone: string;

  @ApiProperty({ example: 202, description: 'ID Tỉnh/Thành (theo GHN)' })
  provinceId: number;

  @ApiProperty({ example: 1444, description: 'ID Quận/Huyện (theo GHN)' })
  districtId: number;

  @ApiProperty({ example: '1A0307', description: 'Mã Phường/Xã (theo GHN)' })
  wardCode: string;

  @ApiProperty({ example: 'Số 123 đường ABC', description: 'Địa chỉ chi tiết' })
  addressDetail: string;

  @ApiProperty({ example: 'Phường Hiệp Bình Chánh, Thành phố Thủ Đức, TP. Hồ Chí Minh' })
  fullAddress: string;

  @ApiProperty({ example: false, description: 'Địa chỉ mặc định' })
  isDefault: boolean;

  @ApiProperty({ example: 'Ghi chú cho tài xế', required: false })
  addressNote?: string;

  constructor(address: Address) {
    this.addressId = Number(address.address_id);
    this.recipientName = address.recipient_name;
    this.phone = address.phone;
    this.provinceId = address.province_id;
    this.districtId = address.district_id;
    this.wardCode = address.ward_code;
    this.addressDetail = address.address_detail;
    this.fullAddress = address.full_address;
    this.isDefault = address.is_default;
    this.addressNote = address.address_note;
  }

  static fromEntity(address: Address): AddressResponseDto {
    return new AddressResponseDto(address);
  }

  static fromEntities(addresses: Address[]): AddressResponseDto[] {
    return addresses.map((address) => new AddressResponseDto(address));
  }
}
