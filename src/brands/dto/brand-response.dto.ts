export class BrandResponseDto {
  id: number;
  code: string;
  name: string;
  image_url: string;
  status: boolean;
  
  // Bạn có thể thêm logic biến đổi dữ liệu ở đây nếu cần
  constructor(brand: any) {
    this.id = Number(brand.brand_id);
    this.code = brand.brand_code;
    this.name = brand.name;
    this.image_url = brand.brand_image;
    this.status = brand.is_active;
  }
}