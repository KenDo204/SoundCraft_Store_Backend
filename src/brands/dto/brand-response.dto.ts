import { ApiProperty } from '@nestjs/swagger';

export class BrandResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'FEND' })
  code: string;

  @ApiProperty({ example: 'Fender' })
  name: string;

  @ApiProperty({ example: 'fender' })
  slug: string; // <-- Thêm slug

  @ApiProperty({ example: 'Thương hiệu sản xuất đàn guitar huyền thoại...', required: false })
  description: string; // <-- Thêm description

  @ApiProperty({ example: 'https://res.cloudinary.com/...' })
  image_url: string;

  @ApiProperty({ example: true })
  status: boolean;
  
  constructor(brand: any) {
    this.id = Number(brand.brand_id);
    this.code = brand.brand_code;
    this.name = brand.name;
    
    // Ánh xạ 2 trường mới từ DB sang DTO
    this.slug = brand.slug;
    this.description = brand.description;
    
    this.image_url = brand.brand_image;
    this.status = brand.is_active;
  }
}