import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Lấy toàn bộ thông tin User
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; 
  },
);

// Lấy riêng UserId (ĐÃ SỬA LẠI ĐƯỜNG DẪN)
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.id; // <-- Đổi từ request.user?.user?.id thành request.user?.id
  },
);