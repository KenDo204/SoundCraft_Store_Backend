import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slider } from './entities/slider.entity';
import { CreateSliderDto } from './dto/create-slider.dto';
import { UpdateSliderDto } from './dto/update-slider.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Brand } from '../brands/entities/brand.entity';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slider)
    private readonly sliderRepository: Repository<Slider>,

    @InjectRepository(Brand) // <--- Tiêm thêm cái này vào
    private readonly brandRepository: Repository<Brand>,

    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // ==========================================
  // PUBLIC API - KHÁCH HÀNG
  // ==========================================
  async getActiveSliders() {
    const sliders = await this.sliderRepository.find({
      where: { is_active: true },
      order: { created_at: 'DESC' },
      relations: ['brand'], 
    });

    // Ép kiểu (Map) y hệt Java để giấu is_active và ngày tháng
    return sliders.map(slider => ({
      slider_id: slider.slider_id,
      title: slider.title,
      sub_title: slider.sub_title,
      target_url: slider.target_url,
      image_url: slider.image_url,
      brand: slider.brand 
    }));
  }

  // ==========================================
  // ADMIN API
  // ==========================================
  async getAllSlidersForAdmin() {
    return await this.sliderRepository.find({
      order: { created_at: 'DESC' },
      relations: ['brand'],
    });
  }

  async getSliderById(id: number) {
    const slider = await this.sliderRepository.findOne({ where: { slider_id: id }, relations: ['brand'] });
    if (!slider) throw new NotFoundException(`Không tìm thấy Slider ID: ${id}`);
    return slider;
  }

  async create(createSliderDto: CreateSliderDto, file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Bắt buộc phải tải lên file ảnh Banner!');

    if (createSliderDto.brand_id) {
      const brandExist = await this.brandRepository.findOne({ where: { brand_id: createSliderDto.brand_id } });
      if (!brandExist) throw new BadRequestException(`Không tìm thấy Thương hiệu với ID: ${createSliderDto.brand_id}`);
    }

    // 2. Upload ảnh lên Cloudinary
    const uploadResult = await this.cloudinaryService.uploadImageBanners(file);

    // 3. Lưu Database
    const newSlider = this.sliderRepository.create({
      ...createSliderDto,
      image_url: uploadResult.secure_url,
    });

    return await this.sliderRepository.save(newSlider);
  }

  async update(id: number, updateSliderDto: UpdateSliderDto, file?: Express.Multer.File) {
    const slider = await this.getSliderById(id);
    let imageUrl = slider.image_url;

    if (updateSliderDto.brand_id) {
      const brandExist = await this.brandRepository.findOne({ where: { brand_id: updateSliderDto.brand_id } });
      if (!brandExist) throw new BadRequestException(`Không tìm thấy Thương hiệu với ID: ${updateSliderDto.brand_id}`);
      
      // Bắt buộc phải gán object mới này vào để TypeORM đè lên object cũ
      slider.brand = brandExist; 
      slider.brand_id = updateSliderDto.brand_id; 
    }

    if (file) {
      // Up ảnh mới
      const uploadResult = await this.cloudinaryService.uploadImageBanners(file);
      imageUrl = uploadResult.secure_url;

      // Xóa ảnh cũ
      if (slider.image_url) {
        const oldPublicId = this.cloudinaryService.extractPublicId(slider.image_url);
        if (oldPublicId) this.cloudinaryService.deleteImage(oldPublicId).catch(() => {});
      }
    }

    const updatedSlider = this.sliderRepository.merge(slider, {
      ...updateSliderDto,
      image_url: imageUrl,
    });

    return await this.sliderRepository.save(updatedSlider);
  }

  // Logic PATCH: Đổi trạng thái (Giống hệt Java toggleSliderStatus)
  async toggleStatus(id: number) {
    const slider = await this.getSliderById(id);
    slider.is_active = !slider.is_active;
    return await this.sliderRepository.save(slider);
  }

  async remove(id: number) {
    const slider = await this.getSliderById(id);

    // Xóa file trên Cloudinary trước khi xóa data
    if (slider.image_url) {
      const publicId = this.cloudinaryService.extractPublicId(slider.image_url);
      if (publicId) this.cloudinaryService.deleteImage(publicId).catch(() => {});
    }

    await this.sliderRepository.remove(slider);
  }
}