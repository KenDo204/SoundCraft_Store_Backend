import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Gender } from '../enums/user-roles.enum';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'Nguyen Van A' })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Tên phải từ 2-100 ký tự' })
  @MaxLength(100, { message: 'Tên phải từ 2-100 ký tự' })
  full_name?: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @Matches(/^(\+84|0)[35789][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  mobile?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ example: '1995-10-25' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;
}