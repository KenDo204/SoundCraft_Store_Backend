import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Product } from '@/products/entities/product.entity';
import { ToggleWishlistDto } from './dto/toggle-wishlist.dto';
import { WishlistStatusResponseDto } from './dto/wishlist-status-response.dto';
import { ProductResponseDto } from '@/products/dto/product-response.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist) private readonly wishlistRepo: Repository<Wishlist>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
  ) { }

  /**
   * Toggle một sản phẩm trong Wishlist của User
   */
  async toggleWishlist(userId: number, dto: ToggleWishlistDto): Promise<WishlistStatusResponseDto> {
    const { productId } = dto;

    const product = await this.productRepo.findOne({ where: { product_id: productId } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const existing = await this.wishlistRepo.findOne({
      where: {
        user: { user_id: userId },
        product: { product_id: productId }
      }
    });

    if (existing) {
      await this.wishlistRepo.delete(existing.wishlist_id);
      return {
        message: 'Đã xóa khỏi danh sách yêu thích',
        isInWishlist: false,
        productId
      };
    } else {
      const newItem = this.wishlistRepo.create({
        user: { user_id: userId } as any,
        product: { product_id: productId } as any
      });
      await this.wishlistRepo.save(newItem);
      return {
        message: 'Đã thêm vào danh sách yêu thích',
        isInWishlist: true,
        productId
      };
    }
  }

  /**
   * Lấy danh sách Wishlist của user hiện tại
   */
  async getMyWishlist(userId: number, query: any = {}) {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 12;
    const skip = (page - 1) * limit;

    const [items, totalElements] = await this.wishlistRepo.findAndCount({
      where: { user: { user_id: userId } },
      relations: ['product', 'product.images', 'product.brand', 'product.category'],
      order: { created_at: 'DESC' },
      skip,
      take: limit
    });

    return {
      items: ProductResponseDto.fromEntities(items.map(wish => wish.product)),
      meta: {
        totalElements,
        totalPages: Math.ceil(totalElements / limit),
        currentPage: page,
        limit,
      }
    };
  }

  /**
   * Kiểm tra xem một sản phẩm có nằm trong Wishlist của user không
   */
  async checkInWishlist(userId: number, productId: number): Promise<WishlistStatusResponseDto> {
    const existing = await this.wishlistRepo.findOne({
      where: {
        user: { user_id: userId },
        product: { product_id: productId }
      }
    });

    return {
      isInWishlist: !!existing,
      productId,
      message: !!existing ? 'Sản phẩm đã có trong mục yêu thích' : 'Sản phẩm chưa có trong mục yêu thích'
    };
  }

  /**
   * Xóa một sản phẩm cụ thể khỏi wishlist (Alternative to toggle)
   */
  async removeFromWishlist(userId: number, productId: number) {
    const result = await this.wishlistRepo.delete({
      user: { user_id: userId },
      product: { product_id: productId }
    });

    if (result.affected === 0) {
      throw new NotFoundException('Sản phẩm không nằm trong danh sách yêu thích');
    }

    return { message: 'Đã xóa khỏi danh sách yêu thích', productId };
  }
}
