import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsNotEmpty({ message: 'Tên không được để trống' })
  full_name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải ít nhất 6 ký tự' })
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  password: string;
}

export class LoginWithGoogleDto {
  @ApiProperty({ description: 'ID Token từ Google' })
  @IsNotEmpty()
  token: string;
}

// Cấu trúc trả về giống hệt LoginResponse bên Java của bạn
export class UserInfo {
  @ApiProperty() id: number;
  @ApiProperty() full_name: string;
  @ApiProperty() email: string;
  @ApiProperty() mobile: string;
  @ApiProperty() role: string;
  @ApiProperty() avatar: string;
}

export class LoginResponseDto {
  @ApiProperty()
  user: UserInfo;

  @ApiProperty()
  access_token: string;
}