import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export type User = {
  id: number | string;
  email: string;
  name: string;
  avatar?: string | null;
};

type AuthResponse = {
  access_token?: string; // ✅ parfois access_token
  token?: string;        // ✅ parfois token
  user?: User;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly base = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'token';

  constructor(private http: HttpClient) {}

  /** ✅ Register + auto-login (stocke le token) */
  register(data: { email: string; password: string; name: string; avatar?: string | null }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/register`, data).pipe(
      tap((res) => this.persistTokenFromResponse(res, 'register'))
    );
  }

  /** ✅ Login + stocke le token */
  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, data)
  }

  /** ✅ Profile */
  me(): Observable<User> {
    return this.http.get<User>(`${this.base}/me`);
  }

  logout(): void {
    this.clearToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // -----------------------
  // helpers (privés)
  // -----------------------
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  private clearToken(): void {
    
  }


  private persistTokenFromResponse(res: AuthResponse, source: 'login' | 'register'): void {
    console.log(res)
    const token = res?.access_token ;
    console.log(token);
    if (!token) {
    
      console.warn(`[AuthService] No token found in ${source} response:`, res);
      return;
    }

    this.setToken(token);
  }
}
