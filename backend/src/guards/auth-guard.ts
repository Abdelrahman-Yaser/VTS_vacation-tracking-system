import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';

interface JwtPayload {
  sub: string; // المعرف الحقيقي في التوكن
  userId?: string; // الحقل الذي سنستخدمه في الكود
  email: string;
  role: string;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return false;
    }

    const token = authHeader.split(' ')[1];
    const decoded = this.verifyToken(token);

    if (!decoded) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    // ✅ الخطوة الأهم: ربط sub بـ userId لضمان وصول الـ ID الصحيح
    request.user = {
      ...decoded,
      userId: decoded.sub,
    };

    // التحقق من الأدوار (Roles)
    const requiredRoles = Reflect.getMetadata('role', context.getHandler()) as
      | string[]
      | undefined;
    if (!requiredRoles) return true;

    return requiredRoles.includes(decoded.role);
  }

  private verifyToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
      return null;
    }
  }
}
