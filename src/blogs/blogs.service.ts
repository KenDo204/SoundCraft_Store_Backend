import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';
import slugify from 'slugify';
import { plainToInstance } from 'class-transformer';
import { BlogResponseUserDto, BlogResponseAdminDto } from './dto/blog-response.dto';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ================= USER =================

  async getPublishedBlogs(page: number = 1, limit: number = 10) {
    const [blogs, total] = await this.blogRepo.findAndCount({
      where: { status: 'PUBLISHED' },
      order: { published_at: 'DESC' },
      relations: ['author'], // Join bảng User để lấy tên tác giả
      skip: (page - 1) * limit,
      take: limit,
    });
    const mappedBlogs = plainToInstance(BlogResponseUserDto, blogs, {
      excludeExtraneousValues: true, // 🌟 Bắt buộc phải có dòng này để loại bỏ các trường thừa
    });
    return { data: mappedBlogs, total, page, limit };
  }

  async getBlogBySlug(slug: string) {
    const blog = await this.blogRepo.findOne({
      where: { slug, status: 'PUBLISHED' },
      relations: ['author'],
    });

    if (!blog) throw new NotFoundException('Bài viết không tồn tại hoặc đã bị ẩn');

    // 🌟 CẢI TIẾN: Tăng view trực tiếp dưới DB để tránh Race Condition
    await this.blogRepo.increment({ blog_id: blog.blog_id }, 'view_count', 1);

    return blog;
  }

  // ================= ADMIN =================

  async getAllAdminBlogs(page: number = 1, limit: number = 10) {
    const [blogs, total] = await this.blogRepo.findAndCount({
      relations: ['author'], // Lấy thông tin người viết
      order: { created_at: 'DESC' }, // Bài mới nhất lên đầu
      skip: (page - 1) * limit,
      take: limit,
    });

    // Ép kiểu về Admin DTO để trả về đủ các trường quản lý (status, created_at,...)
    const mappedBlogs = plainToInstance(BlogResponseAdminDto, blogs, {
      excludeExtraneousValues: true,
    });

    return { data: mappedBlogs, total, page, limit };
  }

  async getAdminBlogById(id: number) {
    const blog = await this.blogRepo.findOne({
      where: { blog_id: id },
      relations: ['author'],
    });

    if (!blog) throw new NotFoundException('Không tìm thấy bài viết');

    return plainToInstance(BlogResponseAdminDto, blog, {
      excludeExtraneousValues: true,
    });
  }

  async createBlog(authorId: number, dto: CreateBlogDto, file?: Express.Multer.File) {
    let baseSlug = slugify(dto.title, { lower: true, locale: 'vi' });
    let isExist = await this.blogRepo.exists({ where: { slug: baseSlug } });

    // Cải tiến nối slug nếu trùng (Dùng timestamp như Java là một cách tốt)
    if (isExist) {
      baseSlug = `${baseSlug}-${Date.now()}`;
    }

    let imageUrl : string | undefined;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImageBlogs(file);
      imageUrl = uploadResult.secure_url;
    }

    const newBlog = this.blogRepo.create({
      ...dto,
      image: imageUrl,
      slug: baseSlug,
      status: 'DRAFT',
      author: { user_id: authorId }, // Giả định id user truyền vào
    });

    return await this.blogRepo.save(newBlog);
  }

  async updateBlog(id: number, dto: UpdateBlogDto, file?: Express.Multer.File) {
    const blog = await this.blogRepo.findOne({ where: { blog_id: id } });
    if (!blog) throw new NotFoundException('Không tìm thấy bài viết');

    let imageUrl = blog.image;
    if (file) {
      // 1. Upload ảnh mới
      const uploadResult = await this.cloudinaryService.uploadImageBlogs(file);
      const newImageUrl = uploadResult.secure_url;

      // 2. Xóa ảnh cũ trên Cloudinary
      if (blog.image) {
        const oldPublicId = this.cloudinaryService.extractPublicId(blog.image);
        if (oldPublicId) {
          try {
            this.cloudinaryService.deleteImage(oldPublicId).catch(() => {});
          } catch (error) {}
        }
      }

      imageUrl = newImageUrl;
    } else if (dto.image !== undefined) {
      // FE có cập nhật url mới (hoặc xóa ảnh)
      if (blog.image && dto.image !== blog.image) {
        const oldPublicId = this.cloudinaryService.extractPublicId(blog.image);
        if (oldPublicId) {
          try {
            this.cloudinaryService.deleteImage(oldPublicId).catch(() => {});
          } catch (error) {}
        }
      }
      imageUrl = dto.image;
    }

    // Tách image ra khỏi dto để gán thủ công
    const { image, ...restDto } = dto;

    Object.assign(blog, { ...restDto, image: imageUrl }); // Map data mới vào entity
    return await this.blogRepo.save(blog);
  }

  async changeStatus(id: number, status: 'PUBLISHED' | 'HIDDEN' | 'DRAFT') {
    const blog = await this.blogRepo.findOne({ where: { blog_id: id } });
    if (!blog) throw new NotFoundException('Không tìm thấy bài viết');

    blog.status = status;
    if (status === 'PUBLISHED') {
      blog.published_at = new Date(); // Gắn ngày xuất bản
    }
    
    await this.blogRepo.save(blog);
    return { message: `Đã đổi trạng thái thành ${status}` };
  }

  async deleteBlog(id: number) {
    const blog = await this.blogRepo.findOne({ where: { blog_id: id } });
    if (!blog) throw new NotFoundException('Không tìm thấy bài viết');

    if (blog.image) {
      const publicId = this.cloudinaryService.extractPublicId(blog.image);
      if (publicId) {
        try {
          await this.cloudinaryService.deleteImage(publicId);
        } catch (error) {
          console.error(`Lỗi khi xóa ảnh trên Cloudinary: ${publicId}`, error);
        }
      }
    }

    const result = await this.blogRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy bài viết');
    return { message: 'Xóa thành công' };
  }
}