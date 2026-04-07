import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { AddressService } from './addresses.service';
import { Address } from './entities/address.entity';
import { GhnService } from '../ghn/ghn.service';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('AddressService - Unit Test', () => {
  let service: AddressService;

  // 1. Tạo các Object giả mạo (Mock) cho các Dependency
  const mockAddressRepository = {
    findOne: jest.fn(),
  };

  const mockGhnService = {
    getProvinces: jest.fn(),
    getDistricts: jest.fn(),
    getWards: jest.fn(),
  };

  // Mock phức tạp hơn một chút cho DataSource (để giả lập Transaction và QueryBuilder)
  const mockEntityManager = {
    createQueryBuilder: jest.fn().mockReturnValue({
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue(true), // Giả vờ update SQL thành công
    }),
    save: jest.fn().mockImplementation((address) => Promise.resolve(address)),
  };

  const mockDataSource = {
    // Giả lập hàm transaction: nhận vào 1 callback và gọi callback đó với mockEntityManager
    transaction: jest.fn().mockImplementation(async (cb) => {
      return await cb(mockEntityManager);
    }),
  };

  // 2. Khởi tạo môi trường Test trước mỗi kịch bản (beforeEach)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressService,
        { provide: getRepositoryToken(Address), useValue: mockAddressRepository },
        { provide: GhnService, useValue: mockGhnService },
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    service = module.get<AddressService>(AddressService);
  });

  // Xóa lịch sử gọi hàm sau mỗi lần test để không bị nhiễu
  afterEach(() => {
    jest.clearAllMocks();
  });

  // =================================================================
  // CÁC KỊCH BẢN KIỂM THỬ (TEST CASES) CHO HÀM setDefaultAddress
  // =================================================================

  describe('setDefaultAddress', () => {
    
    it('Kịch bản 1: Phải báo lỗi 404 nếu không tìm thấy địa chỉ', async () => {
      // Giả lập: DB không tìm thấy địa chỉ (trả về null)
      mockAddressRepository.findOne.mockResolvedValue(null);

      // Kỳ vọng: Khi gọi hàm, nó phải ném ra lỗi NotFoundException
      await expect(service.setDefaultAddress(1, 999)).rejects.toThrow(NotFoundException);
    });

    it('Kịch bản 2: Phải báo lỗi 403 (Forbidden) nếu user thao tác trên địa chỉ của người khác', async () => {
      // Giả lập: DB tìm thấy địa chỉ, nhưng của user_id = 2
      const fakeAddress = { address_id: 10, user: { user_id: 2 } };
      mockAddressRepository.findOne.mockResolvedValue(fakeAddress);

      // Kỳ vọng: User 1 gọi hàm nhưng sửa địa chỉ của User 2 -> Phải văng lỗi Forbidden
      await expect(service.setDefaultAddress(1, 10)).rejects.toThrow(ForbiddenException);
    });

    it('Kịch bản 3: Nếu địa chỉ đã là mặc định sẵn rồi, trả về luôn không cần chọc vào DB', async () => {
      // Giả lập: Tìm thấy địa chỉ hợp lệ, và is_default đang là TRUE
      const fakeAddress = { address_id: 10, user: { user_id: 1 }, is_default: true };
      mockAddressRepository.findOne.mockResolvedValue(fakeAddress);

      const result = await service.setDefaultAddress(1, 10);

      // Kỳ vọng: Trả về chính địa chỉ đó, và hàm transaction tuyệt đối KHÔNG ĐƯỢC GỌI
      expect(result).toEqual(fakeAddress);
      expect(mockDataSource.transaction).not.toHaveBeenCalled();
    });

    it('Kịch bản 4: Chuyển đổi thành công địa chỉ thường thành mặc định', async () => {
      // Giả lập: Tìm thấy địa chỉ hợp lệ, is_default đang là FALSE
      const fakeAddress = { address_id: 10, user: { user_id: 1 }, is_default: false };
      mockAddressRepository.findOne.mockResolvedValue(fakeAddress);

      const result = await service.setDefaultAddress(1, 10);

      // Kỳ vọng 1: Transaction phải được gọi 1 lần
      expect(mockDataSource.transaction).toHaveBeenCalledTimes(1);
      
      // Kỳ vọng 2: Hàm QueryBuilder execute (để reset các địa chỉ khác về false) phải được gọi
      expect(mockEntityManager.createQueryBuilder().execute).toHaveBeenCalledTimes(1);
      
      // Kỳ vọng 3: Hàm save phải được gọi với địa chỉ có is_default = true
      expect(mockEntityManager.save).toHaveBeenCalledWith({
        address_id: 10,
        user: { user_id: 1 },
        is_default: true, // Đã được đổi thành true!
      });

      // Kỳ vọng 4: Kết quả trả về phải có is_default = true
      expect(result.is_default).toBe(true);
    });
  });
});