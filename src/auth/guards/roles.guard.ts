import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  // Reflector dùng để soi các Metadata (những cái nhãn @Roles) mà ta đã gắn
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Lấy danh sách quyền yêu cầu từ Decorator @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu API không gắn @Roles() thì cho qua (ai cũng dùng được)
    if (!requiredRoles) {
      return true;
    }

    // 2. Lấy thông tin user từ request (đã được AuthGuard 'jwt' gán vào trước đó)
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Chưa đăng nhập!');
    }

    // 3. Kiểm tra xem Role của user có nằm trong danh sách yêu cầu không
    const hasRole = requiredRoles.includes(user.role);

    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền truy cập chức năng này!');
    }

    return true; // Cho qua
  }
}