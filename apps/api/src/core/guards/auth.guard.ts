import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { SKIP_AUTH_KEY } from '../decorators/skipAuth.decorator';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const skipAuth = this.reflector.get<boolean>(
      SKIP_AUTH_KEY,
      context.getHandler(),
    );
    if (skipAuth) {
      return true; // Skip authentication
    }
    return super.canActivate(context);
  }
}
