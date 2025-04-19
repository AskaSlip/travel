import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from '../../common/enums/role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.res.locals.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    console.log('User from res.locals.user:', user);
    console.log('Required roles:', this.reflector.get<RoleEnum[]>(ROLES_KEY, context.getHandler()));



    const requiredRoles = this.reflector.get<RoleEnum[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      console.log(`User role "${user.role}" does not have required role(s): ${requiredRoles}`);

      throw new ForbiddenException('You do not have permission for this');
    }

    return true;
  }
}