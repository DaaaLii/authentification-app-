// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


export interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  current: number;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
 
  private base = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}
  


  // ✅ update selon ton backend: PATCH /products/:name
  updateByName(oldName: string, data: Partial<Product>): Observable<Product> {
    return this.http.patch<Product>(`${this.base}/${encodeURIComponent(oldName)}`, data);
  }

  // ✅ delete selon ton backend: DELETE /products/:id
  deleteById(id: string): Observable<{ deleted: true }> {
    return this.http.delete<{ deleted: true }>(`${this.base}/${id}`);
  }
  addproduct(data: { name: string; price: number; stock: number }): Observable<Product> {
    return this.http.post<Product>(this.base, data);
  }
   create(data: { name: string; price: number; stock: number }): Observable<Product> {
    return this.http.post<Product>(this.base, data);
  }



  listPaged(filters: {
  page: number;
  limit: number;
  search?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  minStock?: number | null;
  maxStock?: number | null;
}) {
  const httpParams: any = {
    page: filters.page,
    limit: filters.limit,
  };

  if (filters.search) httpParams.search = filters.search;
  if (filters.minPrice != null) httpParams.minPrice = filters.minPrice;
  if (filters.maxPrice != null) httpParams.maxPrice = filters.maxPrice;
  if (filters.minStock != null) httpParams.minStock = filters.minStock;
  if (filters.maxStock != null) httpParams.maxStock = filters.maxStock;

  return this.http.get<{ items: any[]; total: number , limit:number }>(
    this.base,
    { params: httpParams }
  );
}


 

}
