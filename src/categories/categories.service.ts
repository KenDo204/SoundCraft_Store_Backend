import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, IsNull } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class CategoriesService {
  private readonly MAX_LEVEL = 3;

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ==========================================
  // PUBLIC API - DÀNH CHO KHÁCH HÀNG (TINH HOA BE 1)
  // ==========================================
  async getCategoryTree(includeInactive: boolean = false) {
    // 1. Lấy danh mục (Tùy chọn lọc active hoặc lấy hết)
    const allCategories = await this.categoryRepository.find({
      where: includeInactive ? {} : { is_active: true },
      order: { level: 'ASC', created_at: 'ASC' },
    });

    // 2. Build Tree bằng Map (Tối ưu hiệu năng)
    const categoryMap = new Map();
    const rootCategories: any[] = [];

    // Khởi tạo Map
    allCategories.forEach((cat) => {
      categoryMap.set(Number(cat.category_id), { ...cat, children: [] });
    });

    // Lắp ráp cành lá vào thân cây
    categoryMap.forEach((category) => {
      if (category.parent_id) {
        const parentId = Number(category.parent_id);
        const parent = categoryMap.get(parentId);
        if (parent) {
          parent.children.push(category);
        } else {
          // BỐ TRÍ LẠI: Nếu cha bị ẩn/xóa nhưng con vẫn active, cho nó lên Root để tránh mất dữ liệu
          rootCategories.push(category);
        }
      } else {
        rootCategories.push(category); // Level 1
      }
    });

    return rootCategories;
  }

  // ==========================================
  // ADMIN APIs
  // ==========================================

  // Lấy danh sách có Filter cho Admin
  async getAllForAdmin(keyword?: string, parent_id?: number) {

    console.log("👉 Keyword từ Postman gửi xuống:", keyword);
    
    const whereCondition: any = {};
    if (keyword) whereCondition.name = ILike(`%${keyword}%`);
    if (parent_id) whereCondition.parent_id = parent_id;

    return await this.categoryRepository.find({
      where: whereCondition,
      order: { level: 'ASC', created_at: 'DESC' },
    });
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findOne({ 
      where: { category_id: id },
      relations: ['parent'] 
    });
    if (!category) throw new NotFoundException(`Không tìm thấy Danh mục ID: ${id}`);
    return category;
  }

  async create(createDto: CreateCategoryDto, file?: Express.Multer.File) {
    // 1. Kiểm tra trùng tên
    const nameExist = await this.categoryRepository.findOne({ where: { name: createDto.name } });
    if (nameExist) throw new BadRequestException(`Tên danh mục '${createDto.name}' đã tồn tại!`);

    // 2. Xử lý Logic Level (Từ BE 1)
    let level = 1;
    let parent: Category | null = null;

    if (createDto.parent_id) {
      parent = await this.getCategoryById(createDto.parent_id);
      level = parent!.level + 1;

      if (level > this.MAX_LEVEL) {
        throw new BadRequestException(`Vượt quá độ sâu tối đa (Max Level = ${this.MAX_LEVEL})`);
      }
    }

    // 3. Tự động tạo Slug thân thiện từ Tên
    const slug = this.generateSlug(createDto.name);

    // 4. Up ảnh lên Cloudinary (Thường cho Level 1)
    let imageUrl: string | null = null;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImageCategories(file); // Dùng chung folder banner cũng được
      imageUrl = uploadResult.secure_url;
    }

    const newCategory = this.categoryRepository.create({
      ...createDto,
      slug,
      level,
      parent_id: parent ? Number(parent.category_id) : null,
      image_url: imageUrl,
    });

    return await this.categoryRepository.save(newCategory);
  }

  async update(id: number, updateDto: UpdateCategoryDto, file?: Express.Multer.File) {
    const category = await this.getCategoryById(id);
    let imageUrl: string | null = category.image_url;

    // Giống BE 1: Không cho phép đổi parent_id sau khi tạo để tránh loạn cây cấp độ
    if (updateDto.parent_id && updateDto.parent_id !== Number(category.parent_id)) {
      throw new BadRequestException('Hệ thống không hỗ trợ đổi Danh mục cha sau khi đã tạo để đảm bảo cấu trúc dữ liệu.');
    }

    // Kiểm tra trùng tên (Bỏ qua chính nó)
    if (updateDto.name && updateDto.name !== category.name) {
      const nameExist = await this.categoryRepository.findOne({ where: { name: updateDto.name } });
      if (nameExist) throw new BadRequestException(`Tên danh mục '${updateDto.name}' đã tồn tại!`);
      category.slug = this.generateSlug(updateDto.name); // Đổi tên thì đổi luôn slug
    }

    // Xử lý ảnh: ưu tiên file mới upload, nếu không có thì giữ URL cũ
    if (file) {
      // Upload ảnh mới lên Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImageCategories(file);
      const newImageUrl = uploadResult.secure_url;

      // Xóa ảnh cũ trên Cloudinary (nếu có)
      if (category.image_url) {
        const oldPublicId = this.cloudinaryService.extractPublicId(category.image_url);
        if (oldPublicId) this.cloudinaryService.deleteImage(oldPublicId).catch((err) => {
          console.error('[CẢNH BÁO] Lỗi xóa ảnh cũ Cloudinary:', oldPublicId, err);
        });
      }

      imageUrl = newImageUrl;
    }
    // Nếu không có file mới → giữ nguyên imageUrl = category.image_url (đã gán ở trên)

    // Tách image_url ra khỏi updateDto để tránh bị overwrite bởi spread
    const { image_url: _ignored, file: _file, ...restDto } = updateDto as any;

    const updatedCategory = this.categoryRepository.merge(category, {
      ...restDto,
      image_url: imageUrl,
    });

    return await this.categoryRepository.save(updatedCategory);
  }

  // TINH HOA BE 2: Toggle trạng thái Cha thì Con cũng bị ảnh hưởng
  async toggleStatus(id: number) {
    const category = await this.getCategoryById(id);
    const newStatus = !category.is_active;
    category.is_active = newStatus;

    // Nếu TẮT danh mục Cha, thì tự động TẮT luôn các danh mục Con trực tiếp
    if (newStatus === false) {
      await this.categoryRepository.update(
        { parent_id: category.category_id }, // Tìm các con của nó
        { is_active: false }
      );
    }

    return await this.categoryRepository.save(category);
  }

  // TINH HOA BE 1: Ràng buộc cực chặt trước khi xóa
  async remove(id: number) {
    const category = await this.getCategoryById(id);

    // 1. Kiểm tra có danh mục con không
    const childrenCount = await this.categoryRepository.count({ where: { parent_id: id } });
    if (childrenCount > 0) {
      throw new BadRequestException(`Không thể xóa! Danh mục này đang có ${childrenCount} danh mục con.`);
    }

    // TODO: Sau này làm module Products sẽ thêm đoạn check ProductCount vào đây
    // const productCount = await this.productRepository.count({ where: { category_id: id } });
    // if (productCount > 0) throw new BadRequestException(...);

    // 2. Dọn rác Cloudinary
    if (category.image_url) {
      const publicId = this.cloudinaryService.extractPublicId(category.image_url);
      if (publicId) this.cloudinaryService.deleteImage(publicId).catch(() => {});
    }

    await this.categoryRepository.remove(category);
  }

  // ==========================================
  // HELPER METHODS
  // ==========================================
  
  // Hàm xịn xò chuyển "Đàn Guitar Classic" thành "dan-guitar-classic"
  private generateSlug(text: string): string {
    return text.toString().toLowerCase()
      .normalize('NFD') // Tách dấu ra khỏi chữ
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
      .replace(/đ/g, 'd').replace(/Đ/g, 'D') // Chữ Đ
      .replace(/\s+/g, '-') // Đổi khoảng trắng thành gạch ngang
      .replace(/[^\w\-]+/g, '') // Xóa các ký tự đặc biệt
      .replace(/\-\-+/g, '-') // Xóa gạch ngang thừa
      .replace(/^-+/, '') // Xóa gạch ở đầu
      .replace(/-+$/, ''); // Xóa gạch ở cuối
  }
}