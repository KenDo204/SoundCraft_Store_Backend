import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { BrandResponseDto } from '@/brands/dto/brand-response.dto';
import { CategoryResponse } from '@/categories/dto/category-response.dto';

export class ProductImageResponseDto {
  @ApiProperty({ example: 1 })
  imageId: number;

  @ApiProperty({ example: 'https://link-anh.com/guitar-1.jpg' })
  imageUrl: string;

  @ApiProperty({ example: false })
  isThumbnail: boolean;

  constructor(image: ProductImage) {
    this.imageId = Number(image.image_id);
    this.imageUrl = image.image_url;
    this.isThumbnail = image.is_thumbnail;
  }
}

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  productId: number;

  @ApiProperty({ example: 'Đàn Guitar Yamaha C40' })
  productName: string;

  @ApiProperty({ example: 'dan-guitar-yamaha-c40' })
  slug: string;

  @ApiProperty({ example: 'Mô tả chi tiết...' })
  productDescription: string;

  @ApiProperty({ example: false })
  inPopular: boolean;

  @ApiProperty({ example: true })
  isStock: boolean;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ example: 1500000.00 })
  price: number;

  @ApiProperty({ example: 1800000.00 })
  originalPrice: number;

  @ApiProperty({ example: 10 })
  stockQuantity: number;

  @ApiProperty({ example: 5 })
  maxOrderQuantity: number;

  @ApiProperty({ type: () => BrandResponseDto, required: false })
  brand?: BrandResponseDto;

  @ApiProperty({ type: () => CategoryResponse, required: false })
  category?: CategoryResponse;

  @ApiProperty({ type: [ProductImageResponseDto], required: false })
  images?: ProductImageResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(product: Product) {
    this.productId = Number(product.product_id);
    this.productName = product.product_name;
    this.slug = product.slug;
    this.productDescription = product.product_description;
    this.inPopular = product.in_popular;
    this.isStock = product.is_stock;
    this.status = product.status;
    this.price = Number(product.price);
    this.originalPrice = Number(product.original_price);
    this.stockQuantity = product.stock_quantity;
    this.maxOrderQuantity = product.max_order_quantity;
    this.createdAt = product.created_at;
    this.updatedAt = product.updated_at;

    if (product.brand) {
      this.brand = new BrandResponseDto(product.brand);
    }

    if (product.category) {
      this.category = new CategoryResponse(product.category);
    }

    if (product.images) {
      this.images = product.images.map((img) => new ProductImageResponseDto(img));
    }
  }

  static fromEntity(product: Product): ProductResponseDto {
    return new ProductResponseDto(product);
  }

  static fromEntities(products: Product[]): ProductResponseDto[] {
    return products.map((product) => new ProductResponseDto(product));
  }
}
