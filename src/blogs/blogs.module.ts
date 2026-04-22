import { Module } from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { AuthModule } from '@/auth/auth.module';
import { CloudinaryModule } from '@/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Blog]), AuthModule, CloudinaryModule],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}
