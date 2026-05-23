import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '@/users/enums/user-role.enum';
import { Gender } from '@/users/enums/user-gender.enum';

export class CreateUserDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  @IsString()
  @MinLength(2, { message: 'Tên phải từ 2-100 ký tự' })
  @MaxLength(100, { message: 'Tên phải từ 2-100 ký tự' })
  full_name: string;

  @ApiProperty({ example: 'admin@example.com' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 ký tự' })
  password: string;

  @ApiPropertyOptional({ example: '0987654321' })
  @IsOptional()
  @Matches(/^(\+84|0)[35789][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ' })
  mobile?: string;

  @ApiPropertyOptional({ enum: UserRole, default: UserRole.CUSTOMER })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Vai trò không hợp lệ' })
  role?: UserRole;

  @ApiPropertyOptional({ example: '1995-10-25' })
  @IsOptional()
  @IsString()
  dob?: string;

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender, { message: 'Giới tính không hợp lệ' })
  gender?: Gender;
}
