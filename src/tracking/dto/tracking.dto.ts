import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString, IsArray, ValidateNested, ArrayMinSize, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { UserActionType } from '../enums/user-action.enum';

export class TrackingBehaviorItemDto {
  @ApiPropertyOptional({ description: 'ID người dùng (nếu đã đăng nhập)' })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiPropertyOptional({ description: 'ID phiên (dành cho khách vãng lai)' })
  @IsOptional()
  @IsString()
  sessionId?: string;

  @ApiProperty({ enum: UserActionType, description: 'Loại hành vi' })
  @IsEnum(UserActionType)
  actionType: UserActionType;

  @ApiPropertyOptional({ description: 'ID Nhạc cụ (Bắt buộc với các action liên quan tới sản phẩm)' })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiPropertyOptional({ description: 'ID Danh mục' })
  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Từ khóa tìm kiếm (Bắt buộc với action SEARCH)' })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiPropertyOptional({ description: 'Dữ liệu ngữ cảnh thêm (JSON)' })
  @IsOptional()
  @IsObject()
  contextData?: Record<string, any>;
}

export class TrackingBehaviorBatchDto {
  @ApiProperty({ type: [TrackingBehaviorItemDto], description: 'Danh sách các hành vi' })
  @IsArray()
  @ArrayMinSize(1, { message: 'Danh sách hành vi không được để trống' })
  @ValidateNested({ each: true })
  @Type(() => TrackingBehaviorItemDto)
  behaviors: TrackingBehaviorItemDto[];
}