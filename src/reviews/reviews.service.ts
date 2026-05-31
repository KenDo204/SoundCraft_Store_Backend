import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Between } from 'typeorm';
import { Review } from './entities/review.entity';
import { ReviewImage } from './entities/review-image.entity';
import { OrderItem } from '@/orders/entities/order-item.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewQueryDto } from './dto/review-query.dto';
import { User } from '@/users/entities/user.entity';
import { CloudinaryService } from '@/cloudinary/cloudinary.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(ReviewImage)
    private reviewImageRepository: Repository<ReviewImage>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private cloudinaryService: CloudinaryService,
  ) {}

  // --- Hỗ trợ kiểm tra từ ngữ vi phạm ---
  private readonly badWords = ['chửi', 'bậy', 'xấu', 'tệ']; // Danh sách mẫu

  private containsBadWords(text: string | undefined | null): boolean {
    if (!text) return false;
    const lowerText = text.toLowerCase();
    return this.badWords.some(word => lowerText.includes(word));
  }

  // --- Chức năng cho Người dùng ---

  async create(userId: number, createReviewDto: CreateReviewDto, files: Express.Multer.File[]) {
    const { product_id, order_id, rating, comment } = createReviewDto;

    // 1. Kiểm tra tính hợp lệ (rating là bắt buộc)
    if (!rating) {
      throw new BadRequestException('Vui lòng chọn mức độ hài lòng bằng số sao');
    }

    // 2. Kiểm tra nội dung vi phạm
    if (this.containsBadWords(comment)) {
      throw new BadRequestException('Nội dung đánh giá chứa từ ngữ vi phạm. Vui lòng chỉnh sửa lại.');
    }

    // 3. Kiểm tra xem user đã đánh giá sản phẩm này chưa
    const existingReview = await this.reviewRepository.findOne({
      where: { user: { user_id: userId }, product: { product_id } },
    });

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi.');
    }

    // 4. Tạo review mới
    const review = this.reviewRepository.create({
      user: { user_id: userId } as any,
      product: { product_id } as any,
      order: order_id ? ({ order_id } as any) : null,
      rating: Number(rating),
      comment,
      review_status: 'PENDING',
    });

    const savedReview = await this.reviewRepository.save(review);

    // 5. Cập nhật trạng thái đã đánh giá trong OrderItem (nếu có order_id)
    if (order_id) {
      await this.orderItemRepository.update(
        { order: { order_id: Number(order_id) }, product: { product_id: Number(product_id) } },
        { is_reviewed: true }
      );
    }

    // 6. Upload và Lưu hình ảnh nếu có
    if (files && files.length > 0) {
      const imageUrls = await this.uploadImages(files);
      const reviewImages = imageUrls.map(url => 
        this.reviewImageRepository.create({
          image_url: url,
          review: savedReview,
        })
      );
      await this.reviewImageRepository.save(reviewImages);
    }

    return {
      message: 'Cảm ơn bạn đã đánh giá sản phẩm',
      review: savedReview,
    };
  }

  async update(userId: number, id: number, updateReviewDto: UpdateReviewDto, files: Express.Multer.File[]) {
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    // Kiểm tra quyền sở hữu
    if (Number(review.user.user_id) !== Number(userId)) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa đánh giá này');
    }

    // Kiểm tra thời hạn chỉnh sửa (7 ngày)
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - review.created_at.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 7) {
      throw new BadRequestException('Không thể chỉnh sửa đánh giá này (đã quá thời hạn 7 ngày)');
    }

    if (this.containsBadWords(updateReviewDto.comment)) {
      throw new BadRequestException('Nội dung đánh giá chứa từ ngữ vi phạm. Vui lòng chỉnh sửa lại.');
    }

    // Cập nhật thông tin
    if (updateReviewDto.rating) review.rating = Number(updateReviewDto.rating);
    if (updateReviewDto.comment) review.comment = updateReviewDto.comment;

    // Cập nhật hình ảnh nếu có file mới
    if (files && files.length > 0) {
      // Xóa ảnh cũ
      await this.reviewImageRepository.delete({ review: { review_id: id } });
      
      // Upload và lưu ảnh mới
      const imageUrls = await this.uploadImages(files);
      const reviewImages = imageUrls.map(url => 
        this.reviewImageRepository.create({
          image_url: url,
          review,
        })
      );
      await this.reviewImageRepository.save(reviewImages);
    }

    await this.reviewRepository.save(review);
    return { message: 'Cập nhật đánh giá thành công' };
  }

  async removeByUser(userId: number, id: number) {
    const review = await this.reviewRepository.findOne({
      where: { review_id: id },
      relations: ['user'],
    });

    if (!review) {
      throw new NotFoundException('Không tìm thấy đánh giá');
    }

    if (Number(review.user.user_id) !== Number(userId)) {
      throw new ForbiddenException('Bạn không có quyền xóa đánh giá này');
    }

    await this.reviewRepository.remove(review);
    return { message: 'Xóa đánh giá thành công' };
  }

  // --- Chức năng cho Quản trị viên ---

  async approve(id: number) {
    const review = await this.reviewRepository.findOne({ where: { review_id: id } });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá');

    if (review.review_status !== 'PENDING') {
      throw new BadRequestException('Đánh giá này đã được xử lý');
    }

    if (this.containsBadWords(review.comment)) {
      throw new BadRequestException('Nội dung đánh giá chứa từ ngữ vi phạm. Gợi ý chuyển sang "Ẩn đánh giá".');
    }

    review.review_status = 'PUBLISHED';
    await this.reviewRepository.save(review);
    return { message: 'Duyệt thành công' };
  }

  async hide(id: number) {
    const review = await this.reviewRepository.findOne({ where: { review_id: id } });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá');

    review.review_status = 'HIDDEN';
    await this.reviewRepository.save(review);
    return { message: 'Đã ẩn đánh giá thành công' };
  }

  async removeByAdmin(id: number) {
    const review = await this.reviewRepository.findOne({ where: { review_id: id } });
    if (!review) throw new NotFoundException('Không tìm thấy đánh giá');

    await this.reviewRepository.remove(review);
    return { message: 'Xóa thành công' };
  }

  async findAll(query: ReviewQueryDto) {
    const { rating, status, product_id, sort, page = '1', limit = '10' } = query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};
    if (rating) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating)) {
        throw new BadRequestException('Đánh giá không hợp lệ');
      }
      where.rating = parsedRating;
    }
    if (status) where.review_status = status;
    if (product_id) {
      const parsedProductId = Number(product_id);
      if (isNaN(parsedProductId)) {
        throw new BadRequestException('Mã sản phẩm không hợp lệ');
      }
      where.product = { product_id: parsedProductId };
    }

    const order: any = {};
    if (sort === 'highest_rating') order.rating = 'DESC';
    else if (sort === 'lowest_rating') order.rating = 'ASC';
    else if (sort === 'oldest') order.created_at = 'ASC';
    else order.created_at = 'DESC';

    const [data, total] = await this.reviewRepository.findAndCount({
      where,
      order,
      take: Number(limit),
      skip,
      relations: ['user', 'images', 'product', 'product.images'],
    });

    if (total === 0) {
      return {
        message: 'Không có dữ liệu phù hợp',
        data: [],
        total: 0,
      };
    }

    return { data, total, page: Number(page), limit: Number(limit) };
  }

  async getStatisticsByProduct(productId: number) {
    if (!productId || isNaN(productId)) {
      throw new BadRequestException('Mã sản phẩm không hợp lệ');
    }

    const reviews = await this.reviewRepository.find({
      where: { product: { product_id: productId }, review_status: 'PUBLISHED' },
    });

    if (reviews.length === 0) {
      throw new BadRequestException('Chưa có dữ liệu thống kê cho món này');
    }

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / totalReviews;

    // Chi tiết từng mức sao
    const stars = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      stars[r.rating]++;
    });

    return {
      product_id: productId,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews,
      stars,
    };
  }

  // --- Upload hình ảnh ---
  async uploadImages(files: Express.Multer.File[]) {
    const uploadPromises = files.map(file => this.cloudinaryService.uploadImageReviews(file));
    const results = await Promise.all(uploadPromises);
    return results.map(res => res.secure_url);
  }
}
