import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UploadService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadAvatar(file: File) {
    const form = new FormData();
    form.append('file', file); // ⚠️ doit matcher FileInterceptor('file')
    return this.http.post<{ path: string }>(`${this.base}/upload/avatar`, form);
  }
}
