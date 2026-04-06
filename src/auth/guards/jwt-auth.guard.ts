import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
  // (Tùy chọn) Ghi đè hàm handleRequest để tùy biến câu thông báo lỗi
  // Nếu bạn không ghi đè hàm này, NestJS sẽ tự văng lỗi "Unauthorized" mặc định.
  handleRequest(err: any, user: any, info: any, context: ExecutionContext, status?: any) {
    
    // Nếu có lỗi do thư viện quăng ra, hoặc không giải mã được user từ token
    if (err || !user) {
      // Bạn có thể customize câu thông báo lỗi bằng tiếng Việt ở đây
      throw err || new UnauthorizedException('Bạn cần đăng nhập hoặc cung cấp Token hợp lệ để thực hiện chức năng này!');
    }
    
    // Trả về user (chính là object được return từ hàm validate trong JwtStrategy)
    // Dữ liệu này sẽ tự động được NestJS gán vào request.user
    return user;
  }
}