import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductImage } from './entities/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    private dataSource: DataSource,
  ) {}

  // =====================================
  // NGHIỆP VỤ VALIDATION NỘI BỘ
  // =====================================
  private validateImages(images: any[]) {
    const thumbnailCount = images.filter((img) => img.isThumbnail).length;
    if (thumbnailCount !== 1) {
      throw new BadRequestException('Sản phẩm phải có chính xác 1 ảnh đại diện (Thumbnail)');
    }
  }

  private calculateStockStatus(variants: any[]): boolean {
    const totalStock = variants.reduce((sum, v) => sum + v.stockQuantity, 0);
    return totalStock > 0;
  }

  private getThumbnailUrl(images: any[]): string {
    return images.find(img => img.isThumbnail)?.imageUrl || null;
  }

  // =====================================
  // API TẠO & CẬP NHẬT SẢN PHẨM
  // =====================================
  async createProduct(dto: CreateProductDto) {
    this.validateImages(dto.images);
    const isStock = this.calculateStockStatus(dto.variants);
    const thumbnailUrl = this.getThumbnailUrl(dto.images);

    return this.dataSource.transaction(async (manager) => {
      // 1. Tạo Product
      const product = manager.create(Product, {
        product_code: dto.productCode,
        product_name: dto.productName,
        product_description: dto.productDescription,
        product_img: thumbnailUrl,
        in_popular: dto.inPopular || false,
        is_stock: isStock,
        brand: dto.brandId ? { id: dto.brandId } as any : null, // Relational Mapping
      });
      const savedProduct = await manager.save(product);

      // 2. Tạo Images
      const imagesToSave = dto.images.map((img) =>
        manager.create(ProductImage, {
          image_url: img.imageUrl,
          is_thumbnail: img.isThumbnail,
          product: savedProduct,
        })
      );
      await manager.save(imagesToSave);

      // 3. Tạo Variants
      const variantsToSave = dto.variants.map((v) =>
        manager.create(ProductVariant, {
          size_name: v.sizeName,
          color_name: v.colorName,
          price: v.price,
          stock_quantity: v.stockQuantity,
          product: savedProduct,
        })
      );
      await manager.save(variantsToSave);

      return this.getProductById(savedProduct.product_id); // Trả về Full detail
    });
  }

  async updateProduct(id: number, dto: CreateProductDto) {
    const existingProduct = await this.productRepo.findOne({ where: { product_id: id } });
    if (!existingProduct) throw new NotFoundException('Không tìm thấy sản phẩm');

    this.validateImages(dto.images);
    const isStock = this.calculateStockStatus(dto.variants);
    const thumbnailUrl = this.getThumbnailUrl(dto.images);

    return this.dataSource.transaction(async (manager) => {
      // 1. Cập nhật thông tin gốc
      await manager.update(Product, id, {
        product_code: dto.productCode,
        product_name: dto.productName,
        product_description: dto.productDescription,
        product_img: thumbnailUrl,
        in_popular: dto.inPopular,
        is_stock: isStock,
        brand: dto.brandId ? { id: dto.brandId } as any : null,
      });

      // 2. Clear data cũ (Xóa Images & Variants hiện tại nhờ cơ chế Cascade / tay)
      await manager.delete(ProductImage, { product: { product_id: id } });
      await manager.delete(ProductVariant, { product: { product_id: id } });

      // 3. Chèn data mới
      const newImages = dto.images.map(img => manager.create(ProductImage, { ...img, image_url: img.imageUrl, is_thumbnail: img.isThumbnail, product: { product_id: id } as any }));
      const newVariants = dto.variants.map(v => manager.create(ProductVariant, { ...v, size_name: v.sizeName, color_name: v.colorName, stock_quantity: v.stockQuantity, product: { product_id: id } as any }));
      
      await manager.save(newImages);
      await manager.save(newVariants);

      return this.getProductById(id);
    });
  }

  // =====================================
  // API TRUY VẤN
  // =====================================
  async getProducts(keyword: string = '', page: number = 1, limit: number = 10, isPopular?: boolean) {
    const skip = (page - 1) * limit;
    
    // Xây dựng điều kiện query linh hoạt
    const whereCondition: any = {};
    if (keyword) whereCondition.product_name = Like(`%${keyword}%`);
    if (isPopular !== undefined) whereCondition.in_popular = isPopular;

    const [items, totalElements] = await this.productRepo.findAndCount({
      where: whereCondition,
      relations: ['brand', 'variants'], // Eager load variants để show giá min/max ở list
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
      relations: ['brand', 'variants', 'images'], // Load toàn bộ child entities
      order: {
        images: { is_thumbnail: 'DESC', image_id: 'ASC' }, // Sort Thumbnail lên đầu
      }
    });

    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');
    return product;
  }

  async deleteProduct(id: number) {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Không tìm thấy sản phẩm');
    return { message: 'Đã xóa sản phẩm thành công' };
  }
}