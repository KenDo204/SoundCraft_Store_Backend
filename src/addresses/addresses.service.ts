import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Address } from './entities/address.entity';
import { User } from '../users/entities/user.entity'; 
import { AddressRequestDto } from './dto/address.dto';
import { GhnService } from '../ghn/ghn.service';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    private readonly ghnService: GhnService,
    private readonly dataSource: DataSource, // Quản lý Transaction
  ) {}

  // Lấy danh sách địa chỉ của User
  async getMyAddresses(userId: number): Promise<Address[]> {
    return this.addressRepository.find({
      // Vì khóa ngoại nằm trong relation 'user', ta query thông qua thuộc tính này
      where: { user: { user_id: userId } }, 
      order: { is_default: 'DESC', address_id: 'DESC' }, 
    });
  }

  // Lấy địa chỉ mặc định
  async getDefaultAddress(userId: number): Promise<Address | null> {
    return this.addressRepository.findOne({ 
      where: { user: { user_id: userId }, is_default: true } 
    });
  }

  async getAddressById(userId: number, addressId: number): Promise<Address> {
    return this.getAddressAndCheckOwnership(addressId, userId);
  }

  // Helper check quyền sở hữu
  private async getAddressAndCheckOwnership(addressId: number, userId: number): Promise<Address> {
    // Phải load thêm relation 'user' để có thể so sánh user_id
    const address = await this.addressRepository.findOne({ 
      where: { address_id: addressId },
      relations: ['user'],
    });

    if (!address) throw new NotFoundException('Không tìm thấy địa chỉ');
    if (Number(address.user.user_id) !== Number(userId)) {
      throw new ForbiddenException('Bạn không có quyền truy cập địa chỉ này');
    }
    return address;
  }

  // Helper build full_address
  private async buildFullAddress(detail: string, provinceId: number, districtId: number, wardCode: string): Promise<string> {
    const provinces = await this.ghnService.getProvinces();
    const provinceName = provinces.find(p => p.provinceId === provinceId)?.provinceName || '';

    const districts = await this.ghnService.getDistricts(provinceId);
    const districtName = districts.find(d => d.districtId === districtId)?.districtName || '';

    const wards = await this.ghnService.getWards(districtId);
    const wardName = wards.find(w => w.wardCode === wardCode)?.wardName || '';

    return `${detail.trim()}, ${wardName}, ${districtName}, ${provinceName}`;
  }

  // Tạo mới địa chỉ
  async createAddress(userId: number, dto: AddressRequestDto): Promise<Address> {
    const addressCount = await this.addressRepository.count({ 
      where: { user: { user_id: userId } } 
    });
    
    const isFirstAddress = addressCount === 0;
    const shouldBeDefault = isFirstAddress || dto.isDefault;

    const fullAddress = await this.buildFullAddress(
      dto.addressDetail, dto.provinceId, dto.districtId, dto.wardCode
    );

    return await this.dataSource.transaction(async (manager) => {
      if (shouldBeDefault && !isFirstAddress) {
        // Dùng QueryBuilder để reset tất cả is_default về false cho user này
        await manager.createQueryBuilder()
          .update(Address)
          .set({ is_default: false })
          .where("user_id = :userId", { userId })
          .execute();
      }

      // Map DTO (camelCase) sang Entity (snake_case)
      const newAddress = manager.create(Address, {
        recipient_name: dto.recipientName,
        phone: dto.phone,
        province_id: dto.provinceId,
        district_id: dto.districtId,
        ward_code: dto.wardCode,
        address_detail: dto.addressDetail,
        address_note: dto.addressNote,
        full_address: fullAddress,
        is_default: shouldBeDefault,
        user: { user_id: userId } as User, // Gán object User để TypeORM nhận diện khóa ngoại
      });

      return manager.save(newAddress);
    });
  }

  // Cập nhật địa chỉ
  async updateAddress(userId: number, addressId: number, dto: AddressRequestDto): Promise<Address> {
    const address = await this.getAddressAndCheckOwnership(addressId, userId);

    const isLocationChanged = 
      address.province_id !== dto.provinceId ||
      address.district_id !== dto.districtId ||
      address.ward_code !== dto.wardCode ||
      address.address_detail !== dto.addressDetail;

    let newFullAddress = address.full_address;
    if (isLocationChanged) {
      newFullAddress = await this.buildFullAddress(
        dto.addressDetail, dto.provinceId, dto.districtId, dto.wardCode
      );
    }

    return await this.dataSource.transaction(async (manager) => {
      if (dto.isDefault && !address.is_default) {
        await manager.createQueryBuilder()
          .update(Address)
          .set({ is_default: false })
          .where("user_id = :userId", { userId })
          .execute();
      }

      // Map lại giá trị bằng tay để đảm bảo logic
      address.recipient_name = dto.recipientName;
      address.phone = dto.phone;
      address.province_id = dto.provinceId;
      address.district_id = dto.districtId;
      address.ward_code = dto.wardCode;
      address.address_detail = dto.addressDetail;
      address.address_note = dto.addressNote;
      address.full_address = newFullAddress;
      
      if (dto.isDefault !== undefined) {
        address.is_default = dto.isDefault;
      }

      return manager.save(address);
    });
  }

  // Set Default 1 click
  async setDefaultAddress(userId: number, addressId: number): Promise<Address> {
    const address = await this.getAddressAndCheckOwnership(addressId, userId);
    if (address.is_default) return address;

    await this.dataSource.transaction(async (manager) => {
      // Bỏ default cũ bằng Query Builder
      await manager.createQueryBuilder()
          .update(Address)
          .set({ is_default: false })
          .where("user_id = :userId", { userId })
          .execute();
          
      // Set default mới
      address.is_default = true;
      await manager.save(address);
    });

    return address;
  }

  // Xóa địa chỉ
  async deleteAddress(userId: number, addressId: number): Promise<void> {
    const address = await this.getAddressAndCheckOwnership(addressId, userId);

    await this.dataSource.transaction(async (manager) => {
      await manager.remove(address);

      // Nếu xóa trúng địa chỉ mặc định, tìm địa chỉ cũ nhất gán lên làm mặc định mới
      if (address.is_default) {
        const remainingAddress = await manager.findOne(Address, {
          where: { user: { user_id: userId } },
          order: { address_id: 'ASC' }, 
        });

        if (remainingAddress) {
          remainingAddress.is_default = true;
          await manager.save(remainingAddress);
        }
      }
    });
  }
}