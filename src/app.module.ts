import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { BrandsModule } from './brands/brands.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { CartsModule } from './carts/carts.module';
import { CouponsModule } from './coupons/coupons.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BlogsModule } from './blogs/blogs.module';
import { SlidersModule } from './sliders/sliders.module';
import { NotificationsModule } from './notifications/notifications.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { PreOrdersModule } from './pre-orders/pre-orders.module';
import { RevenuesModule } from './revenues/revenues.module';
import { AddressesModule } from './addresses/addresses.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CategoriesModule } from './categories/categories.module';
import { AdminModule } from './admin/admin.module';
import { GhnModule } from './ghn/ghn.module';
import { SearchModule } from './search/search.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { HomePageModule } from './home-page/home-page.module';
import { TrackingModule } from './tracking/tracking.module';
import { VnpayModule } from './vnpay/vnpay.module';

@Module({
  imports: [
    // 1. Cấu hình đọc file .env toàn cục
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    ScheduleModule.forRoot(),

    // 2. Kết nối PostgreSQL bằng TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        extra: {
          max: 50, // Tăng Pool Size lên (tùy vào cấu hình RAM/CPU của server)
          connectionTimeoutMillis: 5000, // Tự động ngắt kết nối nếu treo quá 5 giây
        },
        autoLoadEntities: true,
        // Ở chế độ dev, synchronize=true giúp tự tạo bảng. Khi bảo vệ xong đem lên thật thì nên tắt.
        // synchronize: true,
        synchronize: false,

        ssl: process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      }),
    }),

    // 3. Cấu hình Mail Service cơ bản
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('MAIL_HOST'),
          port: 587,
          secure: false,
          auth: {
            user: configService.get('MAIL_USER'),
            pass: configService.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: `"Hệ thống Nhạc Cụ" <${configService.get('MAIL_FROM')}>`,
        },
      }),
    }),

    CloudinaryModule,

    AuthModule,

    BrandsModule,

    ProductsModule,

    OrdersModule,

    UsersModule,

    CartsModule,

    CouponsModule,

    ReviewsModule,

    BlogsModule,

    SlidersModule,

    NotificationsModule,

    WishlistsModule,

    PreOrdersModule,

    RevenuesModule,

    AddressesModule,

    CategoriesModule,

    AdminModule,

    GhnModule,

    SearchModule,

    RecommendationModule,

    HomePageModule,

    TrackingModule,

    VnpayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }