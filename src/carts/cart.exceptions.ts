import { BadRequestException } from '@nestjs/common';

export class InsufficientStockException extends BadRequestException {
  constructor(available: number) {
    super(`Số lượng trong kho không đủ (Chỉ còn ${available}).`);
  }
}

export class MaxOrderQuantityExceededException extends BadRequestException {
  constructor(limit: number) {
    super(`Bạn chỉ được mua tối đa ${limit} sản phẩm này.`);
  }
}

export class ProductBannedException extends BadRequestException {
  constructor() {
    super(`Sản phẩm đã ngừng kinh doanh hoặc hết hàng.`);
  }
}

