import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    snapshot: true, // 🌟 Quan trọng nhất là dòng này
  });

  // Mở CORS để Frontend (ReactJS) gọi API không bị lỗi
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite mặc định
      'http://localhost:8080', // Spring cũ/Cổng khác
      'https://sound-craft-store-frontend.vercel.app', // Domain production của bạn
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // Cho phép gửi Cookie/Authorization Header
    exposedHeaders: ['Authorization', 'Content-Disposition'], // Frontend có thể đọc được các header này
  });

  // Tiền tố cho tất cả các API (Ví dụ: localhost:3000/api/...)
  app.setGlobalPrefix('api/v1');

  // Kiểm tra dữ liệu đầu vào
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Tự động xóa các trường không được khai báo trong DTO
      forbidNonWhitelisted: true, // Báo lỗi nếu client gửi trường lạ
      transform: true, // Tự động chuyển kiểu dữ liệu (vd: string '1' -> number 1)
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  // =========================================
  // CẤU HÌNH SWAGGER
  // =========================================
  const config = new DocumentBuilder()
    .setTitle('SoundCraft API')
    .setDescription('Tài liệu API cho dự án đồ án website bán nhạc cụ SoundCraft')
    .setVersion('1.0')
    // Thêm cấu hình để nhập JWT Token trực tiếp trên Swagger
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập Access Token vào đây',
        in: 'header',
      },
      'JWT-auth', // Tên định danh của cơ chế bảo mật này
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Đường dẫn để truy cập Swagger UI (Ví dụ: localhost:3000/api/docs)
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Giữ lại token sau khi F5 trang Swagger
    },
  });
  app.use(cookieParser());
  // Đọc port từ file .env, nếu không có thì chạy port 3000
  const port = process.env.PORT || 8080;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Server đang chạy tại: http://localhost:${port}/api/v1`);
  console.log(`📑 Xem tài liệu Swagger tại: http://localhost:${port}/api/docs`);
}
bootstrap();