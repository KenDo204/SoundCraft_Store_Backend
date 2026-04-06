import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity'; // Trỏ đúng đường dẫn tới User Entity
import { GetUsersQueryDto } from './dto/get-users-query.dto';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailerService: MailerService,
  ) {}

  // 1. Danh sách & Tìm kiếm người dùng
  async getUsers(query: GetUsersQueryDto) {
    const { page, limit, search, isActive, minSpending, maxSpending } = query;
    
    // Tạo QueryBuilder để join với bảng đơn hàng (giả sử tên table là 'orders')
    const queryBuilder = this.userRepository.createQueryBuilder('user')
      .leftJoin('orders', 'order', 'order.userId = user.userId AND order.status = :status', { status: 'COMPLETED' })
      .select([
        'user.userId', 'user.fullName', 'user.email', 'user.mobile', 
        'user.isActive', 'user.role', 'user.createdAt'
      ])
      .addSelect('SUM(COALESCE(order.totalAmount, 0))', 'totalSpending') // Tính tổng chi tiêu
      .groupBy('user.userId');

    // 1. Tìm kiếm nhanh SĐT/Email/Tên
    if (search) {
      queryBuilder.andWhere(
        '(user.email ILIKE :search OR user.mobile ILIKE :search OR user.fullName ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // 2. Lọc theo trạng thái Active/Banned
    if (isActive !== undefined) {
      queryBuilder.andWhere('user.isActive = :isActive', { isActive: isActive === 'true' });
    }

    // 3. Lọc theo tổng chi tiêu (Sử dụng HAVING vì đây là kết quả của hàm SUM)
    if (minSpending !== undefined) {
      queryBuilder.having('SUM(COALESCE(order.totalAmount, 0)) >= :minSpending', { minSpending });
    }
    if (maxSpending !== undefined) {
      queryBuilder.having('SUM(COALESCE(order.totalAmount, 0)) <= :maxSpending', { maxSpending });
    }

    queryBuilder.orderBy('user.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const users = await queryBuilder.getRawMany(); // Lấy dữ liệu dạng raw để có field totalSpending
    const count = await queryBuilder.getCount();

    return {
      data: users,
      meta: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  // 2. Xem chi tiết hồ sơ 360 độ
  async getUserDetail(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      // relations: ['addresses', 'orders'], // Mở comment dòng này khi bạn nối bảng Address và Order
    });
    
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin khách hàng');
    }
    return user;
  }

  // 3. Khóa / Mở khóa tài khoản
  async toggleUserStatus(userId: number, isActive: boolean): Promise<void> {
    const user = await this.getUserDetail(userId);
    user.is_active = isActive;
    await this.userRepository.save(user);
  }

  async forceResetPassword(userId: number, newPass: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: userId } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    // 1. Hash mật khẩu mới & Lưu vào DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
    await this.userRepository.update(userId, { password: hashedPassword });

    // 2. Gửi Email thật cho khách hàng
    try {
      await this.mailerService.sendMail({
        to: user.email, // Gửi đến email của user
        subject: 'Thông báo: Mật khẩu của bạn đã được đặt lại',
        // Bạn có thể dùng template engine như EJS/Handlebars, hoặc viết HTML trực tiếp:
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #2c3e50;">Xin chào ${user.full_name},</h2>
            <p>Quản trị viên hệ thống vừa thực hiện đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Mật khẩu đăng nhập mới của bạn là: <b style="font-size: 18px; color: #e74c3c;">${newPass}</b></p>
            <p>Vì lý do bảo mật, vui lòng đăng nhập và thay đổi mật khẩu này ngay lập tức!</p>
            <br/>
            <p>Trân trọng,</p>
            <p><b>Đội ngũ hỗ trợ hệ thống</b></p>
          </div>
        `,
      });
    } catch (error) {
      console.error('Lỗi khi gửi email:', error);
      // Bạn có thể throw lỗi hoặc log lại tùy vào nghiệp vụ (VD: Không gửi được mail vẫn cho đổi pass, chỉ cảnh báo Admin)
    }
  }
}