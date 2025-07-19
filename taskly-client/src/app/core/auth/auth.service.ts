import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiRequestService } from '../api-request.service';
import { Router } from '@angular/router';
import { AuthApiResponseModel } from '../models/auth-api-response-model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  protected readonly isLoggedIn$ = new BehaviorSubject<boolean>(!!localStorage.getItem('token'));

  constructor(
    private readonly _apiRequestService: ApiRequestService,
    private readonly _router: Router
  ) {}

  public register(data: { name: string; email: string; password: string }) {
    return this._apiRequestService.post<AuthApiResponseModel>('/auth/register', data)
      .pipe(tap(res => this._handleAuth(res)));
  }

  public login(data: { email: string; password: string }) {
    return this._apiRequestService.post<AuthApiResponseModel>('/auth/login', data)
      .pipe(tap(res => this._handleAuth(res)));
  }

  public logout() {
    localStorage.removeItem('token');
    this.isLoggedIn$.next(false);
    this._router.navigate(['/login']);
  }

  private _handleAuth(res: AuthApiResponseModel) {
    localStorage.setItem('token', res.token || '');
    this.isLoggedIn$.next(true);
    this._router.navigate(['/']);
  }

  public getToken() {
    return localStorage.getItem('token');
  }
}
