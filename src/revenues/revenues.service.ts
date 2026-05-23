import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Revenue } from './entities/revenue.entity';
import { Product } from '@/products/entities/product.entity';
import { Category } from '@/categories/entities/category.entity';
import { Order } from '@/orders/entities/order.entity';
import { User } from '@/users/entities/user.entity';
import { UserRole } from '@/users/enums/user-role.enum';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { MonthlyRevenueResponseDto } from './dto/monthly-revenue-response.dto';

@Injectable()
export class RevenuesService {
  constructor(
    @InjectRepository(Revenue) private revenueRepo: Repository<Revenue>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async getDashboardStats(userId: number): Promise<DashboardStatsResponseDto> {
    // Kiểm tra user có phải ADMIN không
    // const user = await this.userRepo.findOne({ where: { user_id: userId } });
    // if (!user || user.role !== UserRole.ADMIN) {
    //   throw new UnauthorizedException('Bạn không có quyền truy cập vào thống kê Admin');
    // }
    
    const [
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      orderStats,
      revenueData,
    ] = await Promise.all([
      this.productRepo.count(),
      this.categoryRepo.count(),
      this.userRepo.count({ where: { role: UserRole.CUSTOMER } }),
      this.orderRepo.count(),
      this.orderRepo
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(*)', 'count')
        .groupBy('order.status')
        .getRawMany(),
      this.orderRepo
        .createQueryBuilder('order')
        .select('SUM(order.total_amount)', 'totalRevenue')
        .where('order.status = :status', { status: 'DELIVERED' })
        .getRawOne(),
    ]);

    // Format order stats into an object
    const ordersByStatus = {
      PENDING: 0,
      SHIPPING: 0,
      DELIVERED: 0,
      CANCELLED: 0,
    };

    orderStats.forEach((stat) => {
      if (ordersByStatus.hasOwnProperty(stat.status)) {
        ordersByStatus[stat.status] = parseInt(stat.count);
      }
    });

    return {
      totalProducts,
      totalCategories,
      totalCustomers,
      totalOrders,
      ordersByStatus,
      totalRevenue: parseFloat(revenueData.totalRevenue || 0),
    };
  }

  async getMonthlyRevenue(year: number): Promise<MonthlyRevenueResponseDto[]> {
    const monthlyData = await this.orderRepo
      .createQueryBuilder('order')
      .select('EXTRACT(MONTH FROM order.created_at)', 'month')
      .addSelect('SUM(order.total_amount)', 'revenue')
      .where('order.status = :status', { status: 'DELIVERED' })
      .andWhere('EXTRACT(YEAR FROM order.created_at) = :year', { year })
      .groupBy('month')
      .orderBy('month', 'ASC')
      .getRawMany();

    // Initialize array with 12 months
    const result = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      revenue: 0,
    }));

    monthlyData.forEach((data) => {
      const monthIdx = parseInt(data.month) - 1;
      if (monthIdx >= 0 && monthIdx < 12) {
        result[monthIdx].revenue = parseFloat(data.revenue);
      }
    });

    return result;
  }

  findAll() {
    return this.revenueRepo.find();
  }

  findOne(id: number) {
    return this.revenueRepo.findOne({ where: { revenue_id: id } });
  }
}
