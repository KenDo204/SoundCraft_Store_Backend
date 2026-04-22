import { PartialType } from '@nestjs/swagger';
import { CreateBlogDto } from './create-blog.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
    @ApiPropertyOptional({ description: 'Truyền chuỗi rỗng "" để xóa ảnh cũ' })
    @IsOptional()
    @IsString()
    image?: string;
}
