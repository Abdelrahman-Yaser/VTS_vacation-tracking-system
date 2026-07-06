import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
interface AuthRequest extends Request {
  user?: Record<string, any>;
}
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): any => {
    // 2. حدد نوع الـ Request هنا باستخدام <Request>
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    const user = request.user;

    return data ? user?.[data] : user;
  },
);
