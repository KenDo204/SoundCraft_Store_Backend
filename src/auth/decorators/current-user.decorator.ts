import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Lấy toàn bộ thông tin User từ Token (đã được Passport decode và gán vào req.user)
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; 
  },
);

// Lấy riêng UserId (Thay cho SecurityUtils.getCurrentUserId())
export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.user?.id; // Lấy từ claim "user.id" mà mình đã tạo ở bước 1
  },
);