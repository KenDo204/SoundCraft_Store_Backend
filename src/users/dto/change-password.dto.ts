import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu hiện tại' })
  @IsString()
  currentPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Vui lòng nhập mật khẩu mới' })
  @IsString()
  @MinLength(8, { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' })
  newPassword: string;
}