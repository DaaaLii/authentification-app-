import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // si passport renvoie une erreur ou pas de user → 401
    if (err || !user) {
      const msg =
        info?.message || err?.message || 'Unauthorized';
      throw new UnauthorizedException(msg);
    }

    return user;
  }
}
