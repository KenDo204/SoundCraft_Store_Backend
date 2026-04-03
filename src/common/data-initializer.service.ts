import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';
import { UserRole } from '@/users/enums/user-role.enum';
import { CartsService } from '@/carts/carts.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DataInitializer implements OnModuleInit {
  private readonly logger = new Logger('DataInitializer');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cartsService: CartsService,
    private readonly dataSource: DataSource, // Thay cho DataSource bên Java
  ) {}

  async onModuleInit() {
    this.logger.log('========================================');
    this.logger.log('🚀 Đang khởi tạo ứng dụng SoundCraft...');
    this.logger.log('========================================');

    await this.checkDatabaseConnection();
    
    // Vì bạn nói không dùng Redis ở NodeJS nên mình bỏ qua checkRedisConnection
    // Nếu sau này bạn dùng, mình sẽ hướng dẫn thêm sau.

    await this.initializeAdminUser();

    this.logger.log('========================================');
    this.logger.log('✅ Khởi tạo hoàn tất!');
    this.logger.log('========================================');
  }

  /**
   * Kiểm tra kết nối Database (Giống checkDatabaseConnection bên Java)
   */
  private async checkDatabaseConnection() {
    try {
      const isConnected = this.dataSource.isInitialized;
      if (isConnected) {
        // Lấy thông tin cấu hình từ driver (Postgres)
        const options = this.dataSource.options as any;
        this.logger.log('🟢 Database kết nối thành công!');
        this.logger.log(`🏠 Database Name: ${options.database}`);
        this.logger.log(`🔗 Host: ${options.host}:${options.port}`);
      }
    } catch (error) {
      this.logger.error(`🔴 Lỗi kết nối Database: ${error.message}`);
    }
  }

  /**
   * Tạo admin user mặc định (Chuyển từ logic Java sang)
   */
  private async initializeAdminUser() {
    const adminEmail = 'admin@gmail.com';
    const adminPassword = 'admin';

    try {
      // 1. Kiểm tra xem admin đã tồn tại chưa (existsByEmail)
      const existingUser = await this.userRepository.findOne({
        where: { email: adminEmail },
      });

      if (existingUser) {
        this.logger.log(`ℹ️ Admin user đã tồn tại: ${adminEmail}`);
        return;
      }

      // 2. Mã hóa mật khẩu (passwordEncoder.encode)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      // 3. Tạo admin user mới (Dùng ROLE_SUPER_ADMIN như Java)
      const adminUser = this.userRepository.create({
        full_name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        is_active: true,
      });

      const savedAdmin = await this.userRepository.save(adminUser);

      // 4. Tạo giỏ hàng đi kèm (Bắt buộc như Java)
    //   await this.cartsService.createNewCart(savedAdmin);

      this.logger.log('✨ Đã tạo admin user thành công!');
      this.logger.log(`📧 Email: ${adminEmail}`);
      this.logger.log(`🔑 Password: ${adminPassword}`);
      this.logger.log('⚠️ Vui lòng đổi mật khẩu sau lần đăng nhập đầu tiên!');

    } catch (error) {
      this.logger.error(`❌ Lỗi khi tạo admin user: ${error.message}`);
    }
  }
}