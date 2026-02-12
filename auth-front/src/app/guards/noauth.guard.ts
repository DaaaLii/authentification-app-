import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const NoauthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const auth = inject(AuthService);

  const token = auth.getToken();

  
  if (token) {
    return router.createUrlTree(['/profile']);
  }
  return true;
};
