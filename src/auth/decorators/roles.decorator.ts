import { SetMetadata } from '@nestjs/common';

// Định nghĩa một hằng số làm chìa khóa lưu dữ liệu
export const ROLES_KEY = 'roles';

// Hàm này sẽ nhận vào một mảng các roles (vd: 'SUPER_ADMIN', 'USER')
// và lưu nó vào metadata của hàm/class
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);