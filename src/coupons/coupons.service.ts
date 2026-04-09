import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Coupon } from './entities/coupon.entity';
import { DiscountType } from './enums/coupon-discount.enum';
import { CouponUsage } from './entities/coupon-usage.entity';
import { CreateCouponDto, ApplyCouponPreviewDto, CommitCouponUsageDto } from './dto/coupons.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private couponRepo: Repository<Coupon>,
    @InjectRepository(CouponUsage) private usageRepo: Repository<CouponUsage>,
  ) {}

  /** * ADMIN: Tạo mã giảm giá 
   */
  async createCoupon(dto: CreateCouponDto): Promise<Coupon> {
    this.validateCouponConstraints(dto);

    const existing = await this.couponRepo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException('Mã giảm giá đã tồn tại.');

    const coupon = this.couponRepo.create({
      code: dto.code,
      discount_type: dto.discountType,
      discount_value: dto.discountValue,
      min_order_amount: dto.minOrderAmount,
      max_discount_amount: dto.maxDiscountAmount,
      max_usage: dto.maxUsage,
      start_date: new Date(dto.startDate),
      end_date: new Date(dto.endDate),
    });

    return await this.couponRepo.save(coupon);
  }

  /**
   * Tính toán Logic dùng chung
   */
  private validateCouponConstraints(dto: CreateCouponDto | Partial<CreateCouponDto>) {
    if (dto.discountType === DiscountType.FIXED) {
      if (Number(dto.discountValue) >= Number(dto.minOrderAmount)) {
        throw new BadRequestException('Giảm cố định: Số tiền giảm phải nhỏ hơn giá trị đơn hàng tối thiểu.');
      }
    } else if (dto.discountType === DiscountType.PERCENT) {
      if (Number(dto.discountValue) < 1 || Number(dto.discountValue) > 100) {
        throw new BadRequestException('Giảm phần trăm: Giá trị phải từ 1 đến 100.');
      }
      if (!dto.maxDiscountAmount) {
        throw new BadRequestException('Giảm phần trăm: Bắt buộc phải nhập Số tiền giảm tối đa (maxDiscountAmount).');
      }
    }

    if (dto.startDate && dto.endDate) {
      const start = new Date(dto.startDate);
      const end = new Date(dto.endDate);
      if (start < new Date()) throw new BadRequestException('Ngày bắt đầu không được trong quá khứ.');
      if (end <= new Date(start.getTime() + 60 * 60 * 1000)) {
        throw new BadRequestException('Ngày kết thúc phải sau ngày bắt đầu ít nhất 1 giờ.');
      }
    }
  }

  /**
   * USER: Xem trước mức giảm giá (Giỏ hàng)
   */
  async applyCouponPreview(userId: number, dto: ApplyCouponPreviewDto) {
    const coupon = await this.validateCouponForApply(dto.couponCode, userId);

    if (Number(dto.totalCartAmount) < Number(coupon.min_order_amount)) {
      throw new BadRequestException(`Đơn hàng chưa đạt mức tối thiểu ${coupon.min_order_amount}đ để dùng mã này.`);
    }

    let discountAmount = 0;
    if (coupon.discount_type === DiscountType.FIXED) {
      discountAmount = Math.min(Number(coupon.discount_value), Number(dto.totalCartAmount));
    } else {
      // Logic: (Tổng tiền * phần trăm) nhưng không vượt quá max_discount_amount
      const rawDiscount = (Number(dto.totalCartAmount) * Number(coupon.discount_value)) / 100;
      discountAmount = Math.min(rawDiscount, Number(coupon.max_discount_amount));
    }

    return {
      totalCartAmount: Number(dto.totalCartAmount),
      discountAmount,
      finalTotal: Number(dto.totalCartAmount) - discountAmount,
      couponCode: coupon.code,
    };
  }

  /**
   * USER: Chốt mã giảm giá (Sau khi thanh toán thành công)
   */
  async commitCouponUsages(userId: number, dto: CommitCouponUsageDto): Promise<void> {
    const uniqueCodes = [...new Set(dto.couponCodes.map(c => c.trim().toUpperCase()))];

    for (const code of uniqueCodes) {
      const coupon = await this.validateCouponForApply(code, userId);

      const usage = this.usageRepo.create({
        coupon: { coupon_id: coupon.coupon_id } as any,
        user: { user_id: userId } as any,
        order: { order_id: dto.orderId } as any,
      });

      await this.usageRepo.save(usage);
    }
  }

  private async validateCouponForApply(rawCode: string, userId: number): Promise<Coupon> {
    const code = rawCode.trim().toUpperCase();
    const coupon = await this.couponRepo.findOne({ where: { code, is_active: true } });

    if (!coupon) throw new NotFoundException('Mã giảm giá không tồn tại hoặc đã bị khóa.');

    const now = new Date();
    if (now < new Date(coupon.start_date) || now > new Date(coupon.end_date)) {
      throw new BadRequestException('Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng.');
    }

    const usedCount = await this.usageRepo.count({ where: { coupon: { coupon_id: coupon.coupon_id } } });
    if (usedCount >= coupon.max_usage) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng trên toàn hệ thống.');
    }

    const hasUserUsed = await this.usageRepo.exists({ 
      where: { user: { user_id: userId }, coupon: { coupon_id: coupon.coupon_id } } 
    });
    
    if (hasUserUsed) {
      throw new BadRequestException('Bạn đã sử dụng mã giảm giá này rồi.');
    }

    return coupon;
  }

  // --- Các hàm Admin cơ bản ---
  async getAllCoupons() { return await this.couponRepo.find({ order: { created_at: 'DESC' } }); }
  
  async toggleActive(couponId: number) {
    const coupon = await this.couponRepo.findOne({ where: { coupon_id: couponId } });
    if (!coupon) throw new NotFoundException();
    coupon.is_active = !coupon.is_active;
    return await this.couponRepo.save(coupon);
  }
}