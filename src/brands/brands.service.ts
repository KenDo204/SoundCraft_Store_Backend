import { 
  Injectable, 
  NotFoundException, 
  BadRequestException, 
  ConflictException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class BrandsService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ==========================================
  // LẤY DANH SÁCH (Tương đương getCategoryTree)
  // ==========================================
  async findAll() {
    // Brand là cấu trúc phẳng (flat list), không cần build tree
    return await this.brandRepository.find({
      order: { created_at: 'DESC' }, // Sắp xếp mới nhất lên đầu
    });
  }

  async findOne(id: number) {
    const brand = await this.brandRepository.findOne({ where: { brand_id: id } });
    if (!brand) {
      throw new NotFoundException(`Không tìm thấy thương hiệu với ID: ${id}`);
    }
    return brand;
  }

  // ==========================================
  // THÊM MỚI
  // ==========================================
  async create(createBrandDto: CreateBrandDto, file: Express.Multer.File) {
    const name = createBrandDto.name.trim();
    const brandCode = createBrandDto.brand_code.trim().toUpperCase(); // Đảm bảo code luôn in hoa

    const existingName = await this.brandRepository.findOne({ where: { name: ILike(name) } });
    if (existingName) {
      throw new ConflictException(`Tên thương hiệu '${name}' đã tồn tại.`);
    }

    const existingCode = await this.brandRepository.findOne({ where: { brand_code: brandCode } });
    if (existingCode) {
      throw new ConflictException(`Mã thương hiệu '${brandCode}' đã tồn tại.`);
    }

    let imageUrl: string | undefined;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImageBrands(file);
      imageUrl = uploadResult.secure_url; 
    }

    // 3. Tạo và lưu Entity
    const newBrand = this.brandRepository.create({
      ...createBrandDto,
      name,
      brand_code: brandCode,
      brand_image: imageUrl,
    });

    return await this.brandRepository.save(newBrand);
  }

  // ==========================================
  // CẬP NHẬT
  // ==========================================
  async update(id: number, updateBrandDto: UpdateBrandDto, file?: Express.Multer.File) {
    // 1. Kiểm tra tồn tại
    const brand = await this.findOne(id);

    // 2. Validation trùng lặp (nếu có gửi lên tên hoặc code mới)
    if (updateBrandDto.name) {
      const name = updateBrandDto.name.trim();
      const existingName = await this.brandRepository.findOne({
        // Tìm tên trùng NHƯNG loại trừ ID hiện tại (Giống existsByNameIgnoreCaseAndCategoryIdNot)
        where: { name: ILike(name), brand_id: Not(id) }, 
      });
      if (existingName) throw new ConflictException(`Tên thương hiệu '${name}' đã tồn tại.`);
      updateBrandDto.name = name;
    }

    if (updateBrandDto.brand_code) {
      const brandCode = updateBrandDto.brand_code.trim().toUpperCase();
      const existingCode = await this.brandRepository.findOne({
        where: { brand_code: brandCode, brand_id: Not(id) },
      });
      if (existingCode) throw new ConflictException(`Mã thương hiệu '${brandCode}' đã tồn tại.`);
      updateBrandDto.brand_code = brandCode;
    }

    let imageUrl = brand.brand_image;
    if (file) {
      // 1. Tải ảnh mới lên Cloudinary
      const uploadResult = await this.cloudinaryService.uploadImageBrands(file);
      const newImageUrl = uploadResult.secure_url;

      // 2. Dọn rác: Xóa ảnh cũ trên Cloudinary (Nếu hãng đã có ảnh trước đó)
      if (brand.brand_image) {
        const oldPublicId = this.cloudinaryService.extractPublicId(brand.brand_image);
        if (oldPublicId) {
          try {
            // Không dùng await ở đây cũng được, để nó chạy ngầm xóa rác, giúp API phản hồi nhanh hơn
            this.cloudinaryService.deleteImage(oldPublicId).catch((err) => {
              console.warn(`[Cảnh báo] Không thể xóa ảnh cũ trên Cloudinary: ${oldPublicId}`, err.message);
            });
          } catch (error) {}
        }
      }

      // 3. Gán URL mới để chuẩn bị lưu DB
      imageUrl = newImageUrl;
    }

    // 3. Cập nhật dữ liệu
    const updatedBrand = this.brandRepository.merge(brand, {
      ...updateBrandDto,
      brand_image: imageUrl,
    });
    return await this.brandRepository.save(updatedBrand);
  }

  // ==========================================
  // XÓA
  // ==========================================
  async remove(id: number) {
    // Lấy brand kèm theo relations products để kiểm tra số lượng
    const brand = await this.brandRepository.findOne({
      where: { brand_id: id },
      relations: ['products'], 
    });

    if (!brand) {
      throw new NotFoundException(`Không tìm thấy thương hiệu với ID: ${id}`);
    }

    // Validation có sản phẩm đang sử dụng không (Giống CategoryInUseException bên Java)
    const productCount = brand.products?.length || 0;
    if (productCount > 0) {
      throw new BadRequestException(
        `Không thể xóa! Thương hiệu '${brand.name}' đang có ${productCount} sản phẩm.`
      );
    }

    // Nếu vượt qua hết thì tiến hành xóa
    await this.brandRepository.remove(brand);
  }
}