import { ApiProperty } from '@nestjs/swagger';

// 1. Dành cho Khách hàng (Đã giấu is_active, created_at, updated_at)
export class SliderPublicResponse {
  @ApiProperty()
  slider_id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  sub_title: string;

  @ApiProperty()
  target_url: string;

  @ApiProperty()
  image_url: string;

  @ApiProperty()
  brand: any; // Trả về thông tin logo hãng
}

// 2. Dành cho Admin (Hiển thị tất tần tật)
export class SliderAdminResponse extends SliderPublicResponse {
  @ApiProperty()
  is_active: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;
}