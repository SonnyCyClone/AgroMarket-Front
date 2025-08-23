import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    // Check localStorage override first, then fallback to environment
    this.baseUrl = localStorage.getItem('agromarket_apiBaseUrl') || environment.apiBaseUrl;
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    // Future: Add Authorization header here when needed
    // const token = localStorage.getItem('agromarket_token');
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }
    
    return headers;
  }

  private getFormDataHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    
    // Don't set Content-Type for FormData - let browser set it with boundary
    // Future: Add Authorization header here when needed
    // const token = localStorage.getItem('agromarket_token');
    // if (token) {
    //   headers = headers.set('Authorization', `Bearer ${token}`);
    // }
    
    return headers;
  }

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  postFormData<T>(endpoint: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, {
      headers: this.getFormDataHeaders()
    });
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
      headers: this.getHeaders()
    });
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders()
    });
  }

  updateBaseUrl(newBaseUrl: string): void {
    this.baseUrl = newBaseUrl;
    localStorage.setItem('agromarket_apiBaseUrl', newBaseUrl);
  }
}
