import { RoleEnum } from '../../member/entities/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUserInterface } from '../interfaces/requestWithUser.interface';

export const RoleGuard = (role: RoleEnum): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context
        .switchToHttp()
        .getRequest<RequestWithUserInterface>();
      const user = request.user;

      return user?.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};
