import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like, IsNull } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service'; 

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductImage) private imageRepo: Repository<ProductImage>,
    private dataSource: DataSource,
    private cloudinaryService: CloudinaryService, 
  ) {}

  // =====================================
  // HELPERS
  // =====================================

  // Parse mảng Variants từ chuỗi JSON (Form-data)
  private parseVariants(variantsData: any): any[] {
    if (!variantsData) return [];
    
    // Nếu Frontend gửi lên chuỗi JSON (khi dùng form-data)
    if (typeof variantsData === 'string') {
      try { 
        return JSON.parse(variantsData); 
      } catch (e) { 
        throw new BadRequestException('Định dạng variants không hợp lệ, phải là chuỗi JSON'); 
      }
    }
    
    // Nếu NestJS đã tự parse thành mảng
    if (Array.isArray(variantsData)) {
      return variantsData;
    }

    return [];
  }

  // Đánh giá tồn kho: Có biến thể thì tính tổng biến thể, không thì lấy tồn kho gốc
  private calculateStockStatus(variants: any[], baseStock: number): number {
    if (variants && variants.length > 0) {
      return variants.reduce((sum, v) => sum + Number(v.stockQuantity), 0);
    }
    return Number(baseStock) || 0;
  }

  private calculateBasePrice(variants: any[], inputPrice: number): number {
    if (variants && variants.length > 0) {
      return Math.min(...variants.map(v => Number(v.price)));
    }
    return Number(inputPrice) || 0;
  }

  // =====================================
  // API TẠO MỚI (CREATE)
  // =====================================
  async createProduct(dto: CreateProductDto, thumbnailFile: Express.Multer.File | null, galleryFiles: Express.Multer.File[]) {
    if (!thumbnailFile) throw new BadRequestException('Bắt buộc phải tải lên ảnh đại diện (thumbnail)');

    const variants = this.parseVariants(dto.variants);
    const totalStock = this.calculateStockStatus(variants, dto.stockQuantity || 0);
    const isStock = totalStock > 0;
    const basePrice = this.calculateBasePrice(variants, dto.price || 0);
    
    // 1. Upload ảnh lên Cloudinary
    const thumbUpload = await this.cloudinaryService.uploadImageProducts(thumbnailFile);
    const thumbnailUrl = thumbUpload.secure_url;

    const galleryUrls: string[] = [];
    if (galleryFiles && galleryFiles.length > 0) {
      const uploadPromises = galleryFiles.map(file => this.cloudinaryService.uploadImageProducts(file));
      const results = await Promise.all(uploadPromises);
      galleryUrls.push(...results.map(r => r.secure_url));
    }

    return this.dataSource.transaction(async (manager) => {
      // 2. Tạo Product
      const product = manager.create(Product, {
        product_name: dto.productName,
        slug: dto.slug,
        product_description: dto.productDescription,
        status: dto.status || 'ACTIVE',
        price: basePrice, 
        stock_quantity: totalStock,
        is_stock: isStock,
        in_popular: dto.inPopular || false,
        brand: dto.brandId ? { brand_id: dto.brandId } as any : null,
      });
      const savedProduct = await manager.save(product);

      // 3. Lưu mảng Hình ảnh vào DB
      const imageEntities = [
        manager.create(ProductImage, { image_url: thumbnailUrl, is_thumbnail: true, product: savedProduct }),
        ...galleryUrls.map(url => manager.create(ProductImage, { image_url: url, is_thumbnail: false, product: savedProduct }))
      ];
      await manager.save(imageEntities);

      // 4. Lưu Variants
      if (variants.length > 0) {
        const variantsToSave = variants.map((v) =>
          manager.create(ProductVariant, {
            size_name: v.sizeName, 
            color_name: v.colorName, 
            price: v.price, 
            stock_quantity: v.stockQuantity, 
            product: savedProduct,
          })
        );
        await manager.save(variantsToSave);
      }

      return manager.findOne(Product, { 
        where: { product_id: savedProduct.product_id }, 
        relations: ['variants', 'images'] 
      });
    });
  }

  // =====================================
  // API CẬP NHẬT (UPDATE)
  // =====================================
  async updateProduct(id: number, dto: CreateProductDto, thumbnailFile: Express.Multer.File | null, galleryFiles: Express.Multer.File[]) {
    const existingProduct = await this.productRepo.findOne({ 
      where: { product_id: id }, 
      relations: ['images'] 
    });
    if (!existingProduct) throw new NotFoundException('Không tìm thấy sản phẩm');

    const variants = this.parseVariants(dto.variants);
    const totalStock = this.calculateStockStatus(variants, dto.stockQuantity || 0);
    const isStock = totalStock > 0;
    const basePrice = this.calculateBasePrice(variants, dto.price || 0);
    
    // XỬ LÝ ẢNH & TÌM ẢNH BỊ XÓA (Garbage Collection)
    const oldImageUrls = existingProduct.images.map(img => img.image_url);
    const retainedUrls: string[] = dto.retainedImagesJson ? JSON.parse(dto.retainedImagesJson) : oldImageUrls; 
    
    const imagesToDeleteFromCloudinary = oldImageUrls.filter(url => !retainedUrls.includes(url));

    // Upload Thumbnail MỚI (nếu có)
    let finalThumbnailUrl = existingProduct.images.find(img => img.is_thumbnail)?.image_url;
    if (thumbnailFile) {
      const thumbUpload = await this.cloudinaryService.uploadImageProducts(thumbnailFile);
      finalThumbnailUrl = thumbUpload.secure_url;
      
      const oldThumb = existingProduct.images.find(img => img.is_thumbnail);
      if (oldThumb && !imagesToDeleteFromCloudinary.includes(oldThumb.image_url)) {
        imagesToDeleteFromCloudinary.push(oldThumb.image_url);
      }
    }

    // Upload Gallery MỚI (nếu có)
    const newGalleryUrls: string[] = [];
    if (galleryFiles && galleryFiles.length > 0) {
      const uploadPromises = galleryFiles.map(file => this.cloudinaryService.uploadImageProducts(file));
      const results = await Promise.all(uploadPromises);
      newGalleryUrls.push(...results.map(r => r.secure_url));
    }

    return this.dataSource.transaction(async (manager) => {
      // 1. Cập nhật thông tin gốc
      await manager.update(Product, id, {
        product_name: dto.productName, 
        slug: dto.slug,
        product_description: dto.productDescription, 
        status: dto.status,
        in_popular: dto.inPopular,
        price: basePrice, 
        stock_quantity: totalStock, 
        is_stock: isStock,
        brand: dto.brandId ? { brand_id: dto.brandId } as any : null,
      });

      // 2. Clear cũ và Chèn DB mới
      await manager.delete(ProductImage, { product: { product_id: id } });
      await manager.delete(ProductVariant, { product: { product_id: id } });

      // Lọc bỏ URL của thumbnail cũ (nếu có trong retained) để không bị nhầm thành gallery
      const finalGalleryUrls = retainedUrls.filter(url => url !== existingProduct.images.find(img => img.is_thumbnail)?.image_url);
      
      const imageEntities = [
        manager.create(ProductImage, { image_url: finalThumbnailUrl, is_thumbnail: true, product: { product_id: id } as any }),
        ...finalGalleryUrls.map(url => manager.create(ProductImage, { image_url: url, is_thumbnail: false, product: { product_id: id } as any })),
        ...newGalleryUrls.map(url => manager.create(ProductImage, { image_url: url, is_thumbnail: false, product: { product_id: id } as any }))
      ];
      await manager.save(imageEntities);

      if (variants.length > 0) {
        const newVariants = variants.map(v => manager.create(ProductVariant, { size_name: v.sizeName, color_name: v.colorName, price: v.price, stock_quantity: v.stockQuantity, product: { product_id: id } as any }));
        await manager.save(newVariants);
      }

      // 3. 🌟 GỌI HÀM CLOUDINARY ĐỂ DỌN RÁC
      imagesToDeleteFromCloudinary.forEach(async (url) => {
        const publicId = this.cloudinaryService.extractPublicId(url);
        if (publicId) {
          await this.cloudinaryService.deleteImage(publicId).catch((err) => {
             console.error(`[CẢNH BÁO] Lỗi xóa ảnh lúc update: ${publicId}`, err);
          });
        }
      });

      return manager.findOne(Product, { 
        where: { product_id: id }, 
        relations: ['variants', 'images'] 
      });
    });
  }

  // =====================================
  // API TRUY VẤN VÀ XÓA
  // =====================================
  async getProducts(keyword: string = '', page: number = 1, limit: number = 10, isPopular?: boolean) {
    const skip = (page - 1) * limit;
    
    const whereCondition: any = {};
    if (keyword) whereCondition.product_name = Like(`%${keyword}%`);
    if (isPopular !== undefined) whereCondition.in_popular = isPopular;

    const [items, totalElements] = await this.productRepo.findAndCount({
      where: whereCondition,
      relations: ['brand', 'variants', 'images'], 
      skip,
      take: limit,
      order: { created_at: 'DESC' },
    });

    return {
      items,
      meta: {
        totalElements,
        totalPages: Math.ceil(totalElements / limit),
        currentPage: page,
        limit,
      }
    };
  }

  async getProductById(id: number) {
    const product = await this.productRepo.findOne({
      where: { product_id: id },
      relations: ['brand', 'variants', 'images'],
      order: {
        images: { is_thumbnail: 'DESC', image_id: 'ASC' },
      }
    });

    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async deleteProduct(id: number) {
    const product = await this.productRepo.findOne({
      where: { product_id: id },
      relations: ['images']
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    const imageUrls = product.images.map(img => img.image_url);
    
    // Xóa trong DB
    await this.productRepo.delete(id);

    // 🌟 GỌI HÀM CLOUDINARY ĐỂ XÓA ẢNH
    if (imageUrls.length > 0) {
      Promise.allSettled(
        imageUrls.map(async (url) => {
          const publicId = this.cloudinaryService.extractPublicId(url);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
          }
        })
      ).then(results => {
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
           console.error(`[CẢNH BÁO] Thất bại khi xóa ${failed.length} ảnh trên Cloudinary cho SP ID ${id}`);
        }
      });
    }

    return { message: 'Đã xóa sản phẩm và dọn sạch hình ảnh trên Cloud' };
  }
}