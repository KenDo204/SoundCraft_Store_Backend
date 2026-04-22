import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, Length } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({ example: 'khachhang@gmail.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Vui lòng nhập email' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'khachhang@gmail.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  @IsNotEmpty({ message: 'Vui lòng nhập email' })
  email: string;

  @ApiProperty({ description: 'Mã OTP 6 số nhận được từ Email' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]{6}$/, { message: 'OTP phải là 6 số' })
  @Length(6, 6, { message: 'Mã xác nhận (OTP) phải bao gồm đúng 6 ký tự' })
  otp: string;

  @ApiProperty({ example: 'MatKhauMoi123!', description: 'Mật khẩu mới của người dùng' })
  @IsString()
  @MinLength(5, { message: 'Mật khẩu mới phải có ít nhất 5 ký tự' })
  newPassword: string;
}