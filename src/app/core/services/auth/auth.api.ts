import { Injectable } from '@angular/core';
import { HttpService } from '../http/http.service';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {

  constructor(private httpService: HttpService) {}

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('/api/auth/login', credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('/api/auth/register', userData);
  }

  refreshToken(): Observable<AuthResponse> {
    return this.httpService.post<AuthResponse>('/api/auth/refresh', {});
  }

  logout(): Observable<void> {
    return this.httpService.post<void>('/api/auth/logout', {});
  }
}
