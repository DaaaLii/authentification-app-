import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info: any) {
    // info = message précis de passport-jwt: "jwt expired", "invalid signature", etc.
    console.log('[JwtAuthGuard] err:', err);
    console.log('[JwtAuthGuard] info:', info);
    console.log('[JwtAuthGuard] user:', user);

   
    return user;
  }
}
