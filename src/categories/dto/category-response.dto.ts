import { ApiProperty } from '@nestjs/swagger';

export class CategoryResponse {
  @ApiProperty()
  category_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  level: number;

  // Lấy tinh hoa BE 1: Dùng đệ quy lồng nhau để FE vẽ Menu 3 cấp dễ dàng
  @ApiProperty({ type: () => [CategoryResponse], required: false })
  children?: CategoryResponse[]; 

  constructor(category: any) {
    if (!category) return;
    this.category_id = Number(category.category_id);
    this.name = category.name;
    this.slug = category.slug;
    this.description = category.description;
    this.image_url = category.image_url;
    this.level = category.level;
    
    if (category.children && category.children.length > 0) {
      this.children = category.children.map(child => new CategoryResponse(child));
    }
  }
}

export class CategoryAdminResponse extends CategoryResponse {
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  parent_id: number; 
}