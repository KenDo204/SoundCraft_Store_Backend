import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { Product } from './entities/product.entity';
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
  ) { }

  // =====================================
  // HELPERS
  // =====================================



  // =====================================
  // API TẠO MỚI (CREATE)
  // =====================================
  async createProduct(dto: CreateProductDto, thumbnailFile: Express.Multer.File | null, galleryFiles: Express.Multer.File[]): Promise<Product> {
    if (!thumbnailFile) throw new BadRequestException('Bắt buộc phải tải lên ảnh đại diện (thumbnail)');

    const originalPrice = Number(dto.originalPrice) || 0;
    const inputPrice = Number(dto.price) || originalPrice; // Mặc định giá bán = giá gốc nếu không nhập

    // Ràng buộc kỹ thuật: Giá bán không được lớn hơn giá gốc
    if (inputPrice > originalPrice) {
      throw new BadRequestException(`Giá bán (${inputPrice}) không được lớn hơn giá gốc (${originalPrice})`);
    }

    const totalStock = dto.stockQuantity || 0;
    const basePrice = inputPrice;
    const isStock = totalStock > 0;
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
        original_price: Number(dto.originalPrice) || 0,
        stock_quantity: totalStock,
        is_stock: isStock,
        in_popular: dto.inPopular || false,
        brand: dto.brandId ? { brand_id: dto.brandId } as any : null,
        category: dto.categoryId ? { category_id: dto.categoryId } as any : null,
      });
      const savedProduct = await manager.save(product);

      // 3. Lưu mảng Hình ảnh vào DB
      const imageEntities = [
        manager.create(ProductImage, { image_url: thumbnailUrl, is_thumbnail: true, product: savedProduct }),
        ...galleryUrls.map(url => manager.create(ProductImage, { image_url: url, is_thumbnail: false, product: savedProduct }))
      ];
      await manager.save(imageEntities);



      return manager.findOneOrFail(Product, {
        where: { product_id: savedProduct.product_id },
        relations: ['brand', 'category', 'images']
      });
    });
  }

  // =====================================
  // API CẬP NHẬT (UPDATE)
  // =====================================
  async updateProduct(id: number, dto: CreateProductDto, thumbnailFile: Express.Multer.File | null, galleryFiles: Express.Multer.File[]): Promise<Product> {
    const existingProduct = await this.productRepo.findOne({
      where: { product_id: id },
      relations: ['images', 'brand', 'category']
    });
    if (!existingProduct) throw new NotFoundException('Không tìm thấy sản phẩm');

    const originalPrice = dto.originalPrice ? Number(dto.originalPrice) : Number(existingProduct.original_price);
    const inputPrice = dto.price ? Number(dto.price) : (dto.originalPrice ? originalPrice : Number(existingProduct.price));

    // Ràng buộc kỹ thuật: Giá bán không được lớn hơn giá gốc
    if (inputPrice > originalPrice) {
      throw new BadRequestException(`Giá bán (${inputPrice}) không được lớn hơn giá gốc (${originalPrice})`);
    }

    const totalStock = dto.stockQuantity || 0;
    const basePrice = inputPrice;
    const isStock = totalStock > 0;
    // XỬ LÝ ẢNH & TÌM ẢNH BỊ XÓA (Garbage Collection)
    const oldImageUrls = existingProduct.images.map(img => img.image_url);

    // Xử lý retainedImagesJson (Frontend gửi mảng ID ảnh cũ muốn giữ lại)
    const hasRetainedImages = dto.retainedImagesJson !== undefined && dto.retainedImagesJson !== null;
    const retainedIds: number[] = hasRetainedImages 
      ? (typeof dto.retainedImagesJson === 'string' ? JSON.parse(dto.retainedImagesJson) : dto.retainedImagesJson) 
      : existingProduct.images.map(img => img.image_id);
    
    // Xác định các ảnh cần xóa trên Cloudinary
    const imagesToDeleteFromCloudinary = existingProduct.images
      .filter(img => {
        if (img.is_thumbnail) {
          return !!thumbnailFile; // Chỉ xóa thumbnail cũ nếu có thumbnail mới thay thế
        }
        return !retainedIds.map(id => Number(id)).includes(Number(img.image_id));
      })
      .map(img => img.image_url);

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
      Object.assign(existingProduct, {
        product_name: dto.productName,
        slug: dto.slug,
        product_description: dto.productDescription,
        status: dto.status,
        in_popular: dto.inPopular,
        price: basePrice,
        original_price: dto.originalPrice ? Number(dto.originalPrice) : existingProduct.original_price,
        stock_quantity: totalStock,
        is_stock: isStock,
        brand: dto.brandId ? ({ brand_id: dto.brandId } as any) : existingProduct.brand,
        category: dto.categoryId ? ({ category_id: dto.categoryId } as any) : existingProduct.category,
      });
      const savedProduct = await manager.save(existingProduct);

      // 2. Xử lý Hình ảnh (TỐI ƯU: Chỉ xóa ảnh không dùng, giữ lại ảnh cũ)
      const imageEntitiesToDelete = existingProduct.images.filter(img => {
        // Nếu là thumbnail: Chỉ xóa nếu có thumbnail mới thay thế (thumbnailFile tồn tại)
        if (img.is_thumbnail) {
          return !!thumbnailFile;
        }
        // Nếu là ảnh gallery: Xóa nếu không nằm trong danh sách giữ lại
        return !retainedIds.map(id => Number(id)).includes(Number(img.image_id));
      });

      if (imageEntitiesToDelete.length > 0) {
        const idsToDelete = imageEntitiesToDelete.map(img => img.image_id);
        await manager.delete(ProductImage, idsToDelete);
        
        // Thêm vào danh sách xóa trên Cloudinary
        imageEntitiesToDelete.forEach(img => {
          if (!imagesToDeleteFromCloudinary.includes(img.image_url)) {
            imagesToDeleteFromCloudinary.push(img.image_url);
          }
        });
      }

      const newImageEntities: ProductImage[] = [];
      if (thumbnailFile) {
        newImageEntities.push(manager.create(ProductImage, {
          image_url: finalThumbnailUrl,
          is_thumbnail: true,
          product: savedProduct
        }));
      }
      if (newGalleryUrls.length > 0) {
        newGalleryUrls.forEach(url => {
          newImageEntities.push(manager.create(ProductImage, {
            image_url: url,
            is_thumbnail: false,
            product: savedProduct
          }));
        });
      }
      if (newImageEntities.length > 0) {
        await manager.save(newImageEntities);
      }


      // 4. 🌟 GỌI HÀM CLOUDINARY ĐỂ DỌN RÁC
      if (imagesToDeleteFromCloudinary.length > 0) {
        imagesToDeleteFromCloudinary.forEach(async (url) => {
          const publicId = this.cloudinaryService.extractPublicId(url);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId).catch((err) => {
              console.error(`[CẢNH BÁO] Lỗi xóa ảnh Cloudinary: ${publicId}`, err);
            });
          }
        });
      }

      return manager.findOneOrFail(Product, {
        where: { product_id: id },
        relations: ['brand', 'category', 'images']
      });
    });
  }

  // =====================================
  // API TRUY VẤN VÀ XÓA
  // =====================================
  async getNewArrivals(query: any = {}): Promise<{ items: Product[]; meta: any }> {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 12; // Mặc định là 12 theo yêu cầu của user
    const skip = (page - 1) * limit;

    const { tags, brandId, categoryId, slug, priceMin, priceMax } = query;

    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.status = :status', { status: 'ACTIVE' });

    // Hỗ trợ lọc nâng cao cho hàng mới về
    if (brandId) qb.andWhere('product.brand_id = :brandId', { brandId: Number(brandId) });
    if (categoryId) qb.andWhere('product.category_id = :categoryId', { categoryId: Number(categoryId) });
    if (slug) qb.andWhere('(brand.slug = :slug OR category.slug = :slug)', { slug });
    if (priceMin) qb.andWhere('product.price >= :priceMin', { priceMin: Number(priceMin) });
    if (priceMax) qb.andWhere('product.price <= :priceMax', { priceMax: Number(priceMax) });

    // Lọc theo Danh mục/Tags
    if (tags) {
      const decodedTag = decodeURIComponent(tags);
      qb.andWhere('category.name = :tag', { tag: decodedTag });
    }

    // Luôn sắp xếp giảm dần theo ngày tạo (Hàng mới nhất)
    qb.orderBy('product.created_at', 'DESC');

    // Phân trang
    qb.skip(skip).take(limit);

    // Lấy dữ liệu và tổng số bản ghi thỏa mãn điều kiện
    const [items, totalElements] = await qb.getManyAndCount();

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

  async getProducts(query: any): Promise<{ items: Product[]; meta: any }> {
    // 1. Trích xuất các tham số từ query
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;

    const { keyword, brandId, categoryId, slug, priceMin, priceMax, inStock, color, isPopular, tags } = query;

    // 2. Khởi tạo QueryBuilder
    const qb = this.productRepo.createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images');

    // 3. Nối các điều kiện lọc (Dynamically Add WHERE Clauses)

    if (keyword) {
      qb.andWhere('product.product_name LIKE :keyword', { keyword: `%${keyword}%` });
    }

    if (isPopular !== undefined) {
      // Ép kiểu vì URL gửi lên là dạng chuỗi 'true' hoặc 'false'
      const isPop = isPopular === 'true' || isPopular === true;
      qb.andWhere('product.in_popular = :isPop', { isPop });
    }

    if (brandId) {
      qb.andWhere('product.brand_id = :brandId', { brandId: Number(brandId) });
    }

    if (categoryId) {
      qb.andWhere('product.category_id = :categoryId', { categoryId: Number(categoryId) });
    }

    if (slug) {
      qb.andWhere('(brand.slug = :slug OR category.slug = :slug)', { slug });
    }

    if (tags) {
      // Tags ở đây ta quy ước là lọc theo Tên danh mục (Category Name)
      qb.andWhere('category.name = :tags', { tags });
    }

    if (priceMin) {
      qb.andWhere('product.price >= :priceMin', { priceMin: Number(priceMin) });
    }

    if (priceMax) {
      qb.andWhere('product.price <= :priceMax', { priceMax: Number(priceMax) });
    }

    if (inStock !== undefined && inStock !== null) {
      if (inStock === 'true' || inStock === true) {
        qb.andWhere('product.is_stock = :inStock', { inStock: true });
        // Hoặc: qb.andWhere('product.stock_quantity > 0');
      } else if (inStock === 'false' || inStock === false) {
        qb.andWhere('product.is_stock = :inStock', { inStock: false });
        // Hoặc: qb.andWhere('product.stock_quantity <= 0');
      }
    }

    // 4. Thực thi Query (Order, Pagination)
    qb.orderBy('product.created_at', 'DESC');
    qb.skip(skip).take(limit);

    // Lấy dữ liệu và tổng số bản ghi thỏa mãn điều kiện
    const [items, totalElements] = await qb.getManyAndCount();

    // 5. Trả về format chuẩn
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

  async getProductById(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { product_id: id },
      relations: ['brand', 'category', 'images'],
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

  async releaseStock(
    params: { productId?: number; variantId?: number; quantity: number },
    queryRunner: QueryRunner,
  ): Promise<void> {
    const { productId, variantId, quantity } = params;


    if (productId) {
      // 2. Hoàn kho cho Sản phẩm gốc
      const product = await queryRunner.manager.findOne(Product, {
        where: { product_id: productId },
      });

      if (!product) throw new NotFoundException(`Không tìm thấy sản phẩm: ${productId}`);

      if (product.stock_quantity !== -1) {
        product.stock_quantity += quantity;
        await queryRunner.manager.save(Product, product);
      }
    }
  }
}