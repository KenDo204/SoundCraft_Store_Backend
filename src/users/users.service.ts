import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '@/auth/dto/auth.dto';
import { CartsService } from '@/carts/carts.service';
import { RevenuesService } from '@/revenues/revenues.service'; 
import { UserRole } from '@/users/enums/user-role.enum';
import { ChangePasswordDto } from '@/users/dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ResetPasswordDto } from '@/auth/dto/forgot-password.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartsService: CartsService,
    private readonly revenuesService: RevenuesService,
    private readonly mailerService: MailerService,
  ) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { email },
      select: ['user_id', 'email', 'password', 'full_name', 'role', 'is_active', 'avatar', 'mobile']
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ 
      where: { user_id: id },
      relations: ['addresses'] 
    });
  }

  async getMyInfo(userId: number): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new NotFoundException('Không tìm thấy thông tin tài khoản!');
    }
    return user;
  }

  // --- CREATE USER (Đăng ký truyền thống) ---
  async createUser(dto: RegisterDto): Promise<User> {
    // 1. Hash mật khẩu (BCrypt)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    // 2. Lưu User
    const newUser = this.userRepository.create({
      full_name: dto.full_name,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      is_active: true,
    });
    const savedUser = await this.userRepository.save(newUser);

    // 3. Tạo Giỏ hàng rỗng (Bắt buộc)
    // await this.cartsService.createNewCart(savedUser);

    // 4. Tạo User Stats/Revenue khởi tạo (Bắt buộc)
    // await this.revenuesService.initializeUserStats(savedUser); 

    return savedUser;
  }

  // --- CREATE USER FROM SOCIAL (Google) ---
  async createUserFromSocial(name: string, email: string, avatar: string): Promise<User> {
    const newUser = this.userRepository.create({
      full_name: name,
      email: email,
      avatar: avatar,
      password: '', // Social login không cần mật khẩu
      role: UserRole.CUSTOMER,
      is_active: true,
    });
    const savedUser = await this.userRepository.save(newUser);
    
    // await this.cartsService.createNewCart(savedUser);
    return savedUser;
  }

  // --- UPDATE PROFILE ---
  async updateUser(userId: number, dto: any): Promise<User> {
    const user = await this.findUserById(userId);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    if (dto.mobile && dto.mobile !== user.mobile) {
      const isMobileTaken = await this.userRepository.findOne({ where: { mobile: dto.mobile } });
      if (isMobileTaken) throw new BadRequestException('Số điện thoại đã tồn tại');
      user.mobile = dto.mobile;
    }

    if (dto.full_name) user.full_name = dto.full_name;
    if (dto.avatar) user.avatar = dto.avatar;
    if (dto.gender) user.gender = dto.gender;

    // 3. Nghiệp vụ tính tuổi (phải >= 18)
    if (dto.dob) {
      const dobDate = new Date(dto.dob);
      const age = new Date().getFullYear() - dobDate.getFullYear();
      if (age < 18) {
        throw new BadRequestException('Người dùng phải từ 18 tuổi trở lên');
      }
      user.dob = dobDate;
    }

    return this.userRepository.save(user);
  }

  // --- CHANGE PASSWORD ---
  async changePassword(userId: number, dto: ChangePasswordDto): Promise<void> {
    // Phải query tường minh password vì trong Entity đã cấu hình select: false
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      select: ['user_id', 'password'] 
    });

    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    // Kiểm tra mật khẩu hiện tại
    const isMatch = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng!');
    }

    // Hash và lưu mật khẩu mới
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(dto.newPassword, salt);
    await this.userRepository.save(user);
  }

  async requestForgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    // Bảo mật: Kể cả khi email không tồn tại, cũng không nên văng lỗi "Không tìm thấy user"
    // để tránh hacker dò quét email trong hệ thống. Cứ trả về success.
    if (!user) return; 

    // 1. Sinh mã OTP 6 chữ số ngẫu nhiên
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 2. Cài đặt thời gian hết hạn (ví dụ: 15 phút kể từ bây giờ)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    // 3. Lưu vào DB
    user.resetPasswordToken = otp;
    user.resetPasswordExpires = expiresAt;
    await this.userRepository.save(user);

    // 4. Gửi Email cho khách
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: '[Nhạc Cụ System] Mã xác nhận đặt lại mật khẩu',
        html: `
          <h2>Xin chào ${user.full_name},</h2>
          <p>Bạn vừa yêu cầu đặt lại mật khẩu. Dưới đây là mã xác nhận (OTP) của bạn:</p>
          <h1 style="color: blue; letter-spacing: 5px;">${otp}</h1>
          <p>Mã này sẽ hết hạn trong 15 phút. Tuyệt đối không chia sẻ mã này cho bất kỳ ai.</p>
        `,
      });
    } catch (error) {
      console.error('Lỗi gửi mail OTP:', error);
      // Tùy chọn: Xử lý rollback hoặc throw lỗi hệ thống nếu cần
    }
  }

  // --- XÁC NHẬN OTP VÀ ĐỔI MẬT KHẨU ---
  async resetPasswordWithOtp(dto: ResetPasswordDto): Promise<void> {
    // Phải select thêm token và expires vì ở Entity ta để select: false
    const user = await this.userRepository.findOne({
      where: { email: dto.email },
      select: ['user_id', 'password', 'resetPasswordToken', 'resetPasswordExpires']
    });

    if (!user) {
      throw new BadRequestException('Mã xác nhận hoặc email không hợp lệ');
    }

    // Kiểm tra OTP có khớp không
    if (user.resetPasswordToken !== dto.otp) {
      throw new BadRequestException('Mã xác nhận không chính xác');
    }

    // Kiểm tra OTP còn hạn không
    const now = new Date();
    if (user.resetPasswordExpires! < now) {
      throw new BadRequestException('Mã xác nhận đã hết hạn, vui lòng yêu cầu gửi lại');
    }

    // Hash mật khẩu mới và lưu
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(dto.newPassword, salt);
    
    // Quan trọng: Xóa trắng mã OTP sau khi dùng thành công
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    
    await this.userRepository.save(user);
  }
}