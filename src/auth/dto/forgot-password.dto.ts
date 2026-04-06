import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'khachhang@gmail.com' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Mã OTP 6 số nhận được từ Email' })
  @IsString()
  @IsNotEmpty()
  otp: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải từ 8 ký tự' })
  newPassword: string;
}