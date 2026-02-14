import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

export interface UserMini {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private base = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  listUsers(role: 'admin' | 'user' = 'user'): Observable<UserMini[]> {
    return this.http.get<UserMini[]>(this.base, { params: { role } as any });
  }
}
