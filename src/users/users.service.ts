import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from '@/auth/dto/auth.dto';
import { CartsService } from '@/carts/carts.service';
import { RevenuesService } from '@/revenues/revenues.service'; 
import { UserRole } from '@/users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartsService: CartsService,
    private readonly revenuesService: RevenuesService,
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
      role: 'ROLE_CUSTOMER',
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
      role: 'ROLE_CUSTOMER',
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

    user.full_name = dto.fullName || user.full_name;
    user.avatar = dto.avatar || user.avatar;

    return this.userRepository.save(user);
  }

  // --- CHANGE PASSWORD ---
  async updatePassword(userId: number, newPass: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
    await this.userRepository.update(userId, { password: hashedPassword });
  }
}