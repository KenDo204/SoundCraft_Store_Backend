import { Injectable, Inject, BadRequestException, InternalServerErrorException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { firstValueFrom } from 'rxjs';
import { plainToInstance } from 'class-transformer';
import {
  GhnProvinceDto,
  GhnDistrictDto,
  GhnWardDto,
  ShippingFeeRequestDto,
  AvailableServiceDto,
  ShippingFeeResponseDto,
} from './dto/ghn.dto';

interface GhnBaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

@Injectable()
export class GhnService {
  private readonly logger = new Logger(GhnService.name);
  private readonly baseUrl = process.env.GHN_API_URL || 'https://dev-online-gateway.ghn.vn/shiip/public-api';
  private readonly token = process.env.GHN_TOKEN;
  private readonly shopId = Number(process.env.GHN_SHOP_ID);

  constructor(
    private readonly httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  private get headers() {
    return {
      token: this.token,
      'Content-Type': 'application/json',
    };
  }

  // ==========================================
  // MASTER DATA - ĐÃ FIX LỖI CACHE VÀ RETURN
  // ==========================================

  async getProvinces(): Promise<GhnProvinceDto[]> {
    const cacheKey = 'ghn_provinces';
    const cachedData = await this.cacheManager.get<GhnProvinceDto[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      // 1. Chỉ định rõ Generic Type cho HttpService
      const response = await firstValueFrom(
        this.httpService.get<GhnBaseResponse<any[]>>(`${this.baseUrl}/master-data/province`, { headers: this.headers })
      );
      
      // 2. Ép kiểu (Type Casting) rõ ràng (as GhnProvinceDto[]) để fix lỗi Return
      const mappedData = plainToInstance(GhnProvinceDto, response.data.data) as GhnProvinceDto[];
      
      // 3. Fix Cache: Dùng số mili-giây (86400000 = 24h) cho cache-manager v5. 
      // *Lưu ý: Nếu bạn đang cài cache-manager bản cũ (v4), hãy đổi thành: { ttl: 86400 }
      await this.cacheManager.set(cacheKey, mappedData, 86400000); 
      
      return mappedData;
    } catch (error: any) {
      this.logger.error(`Error fetching provinces: ${error.message}`);
      throw new InternalServerErrorException('Không thể kết nối đến GHN để lấy danh sách tỉnh thành.');
    }
  }

  async getDistricts(provinceId: number): Promise<GhnDistrictDto[]> {
    const cacheKey = `ghn_districts_${provinceId}`;
    const cachedData = await this.cacheManager.get<GhnDistrictDto[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<GhnBaseResponse<any[]>>(`${this.baseUrl}/master-data/district`, {
          headers: this.headers,
          params: { province_id: provinceId },
        })
      );
      
      const mappedData = plainToInstance(GhnDistrictDto, response.data.data) as GhnDistrictDto[];
      
      await this.cacheManager.set(cacheKey, mappedData, 86400000);
      return mappedData;
    } catch (error: any) {
      this.logger.error(`Error fetching districts: ${error.message}`);
      throw new InternalServerErrorException('Không thể kết nối đến GHN để lấy danh sách quận huyện.');
    }
  }

  async getWards(districtId: number): Promise<GhnWardDto[]> {
    const cacheKey = `ghn_wards_${districtId}`;
    const cachedData = await this.cacheManager.get<GhnWardDto[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<GhnBaseResponse<any[]>>(`${this.baseUrl}/master-data/ward`, {
          headers: this.headers,
          params: { district_id: districtId },
        })
      );
      
      const mappedData = plainToInstance(GhnWardDto, response.data.data) as GhnWardDto[];
      
      await this.cacheManager.set(cacheKey, mappedData, 86400000);
      return mappedData;
    } catch (error: any) {
      this.logger.error(`Error fetching wards: ${error.message}`);
      throw new InternalServerErrorException('Không thể kết nối đến GHN để lấy danh sách phường xã.');
    }
  }

  // ==========================================
  // SHIPPING FEE - KHÔNG CACHE
  // ==========================================

  async getAvailableServices(fromDistrict: number, toDistrict: number): Promise<AvailableServiceDto[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<GhnBaseResponse<any[]>>(
          `${this.baseUrl}/v2/shipping-order/available-services`,
          {
            shop_id: this.shopId,
            from_district: fromDistrict,
            to_district: toDistrict,
          },
          { headers: this.headers }
        )
      );

      const responseData = response.data.data;

      if (!responseData || responseData.length === 0) {
        throw new BadRequestException('Không có dịch vụ vận chuyển nào hỗ trợ tuyến đường này.');
      }

      return plainToInstance(AvailableServiceDto, responseData) as AvailableServiceDto[];
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error(`Error get available services: ${error.message}`);
      throw new InternalServerErrorException('Lỗi khi lấy dịch vụ vận chuyển từ GHN.');
    }
  }

  async calculateShippingFee(payload: ShippingFeeRequestDto): Promise<ShippingFeeResponseDto> {
    try {
      // Bước 1: Lấy dịch vụ khả dụng
      const availableServices = await this.getAvailableServices(
        payload.fromDistrictId,
        payload.toDistrictId
      );

      // Bước 2: Chọn dịch vụ đầu tiên làm mặc định
      const selectedService = availableServices[0];

      // Bước 3: Gọi API tính phí
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/v2/shipping-order/fee`,
          {
            shop_id: this.shopId,
            service_id: selectedService.serviceId,
            service_type_id: selectedService.serviceTypeId,
            from_district_id: payload.fromDistrictId,
            to_district_id: payload.toDistrictId,
            to_ward_code: payload.toWardCode,
            weight: payload.weight,
            length: payload.length || 0,
            width: payload.width || 0,
            height: payload.height || 0,
            insurance_value: payload.insuranceValue || 0,
          },
          {
            headers: { ...this.headers, ShopId: this.shopId },
          }
        )
      );

      const feeData = data.data;

      return {
        totalFee: feeData.total,
        serviceFee: feeData.service_fee,
        insuranceFee: feeData.insurance_fee,
        expectedDeliveryTime: feeData.expected_delivery_time,
        serviceId: selectedService.serviceId,
        serviceName: selectedService.serviceName,
        availableServices, // Trả về danh sách để Frontend có thể cho user đổi gói ship
      };
    } catch (error) {
      const ghnErrorMsg = error.response?.data?.message || '';
      if (error.response?.status === 400) {
        throw new BadRequestException(`Lỗi cấu hình giao hàng: ${ghnErrorMsg}`);
      }
      this.logger.error(`Error calculating fee: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Không thể tính phí vận chuyển lúc này.');
    }
  }
}