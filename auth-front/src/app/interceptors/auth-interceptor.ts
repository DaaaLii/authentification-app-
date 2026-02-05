import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // ✅ même clé que AuthService

  // ✅ ne pas toucher aux endpoints publics
  const isPublic =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register');

  if (!token || isPublic) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    })
  );
};
