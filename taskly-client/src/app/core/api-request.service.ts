import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environments } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ApiRequestService {

  private readonly _baseUrl = environments.apiBaseUrl;

  constructor(private readonly _httpClient: HttpClient) { }

  get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this._httpClient.get<T>(`${this._baseUrl}${endpoint}`, { params })
      .pipe(catchError(this._handleApiError));
  }

  post<T>(endpoint: string, body: any): Observable<T> {
    return this._httpClient.post<T>(`${this._baseUrl}${endpoint}`, body)
      .pipe(catchError(this._handleApiError));
  }

  put<T>(endpoint: string, body: any): Observable<T> {
    return this._httpClient.put<T>(`${this._baseUrl}${endpoint}`, body)
      .pipe(catchError(this._handleApiError));
  }

  patch<T>(endpoint: string, body: any): Observable<T> {
    return this._httpClient.patch<T>(`${this._baseUrl}${endpoint}`, body)
      .pipe(catchError(this._handleApiError));
  }

  delete<T>(endpoint: string): Observable<T> {
    return this._httpClient.delete<T>(`${this._baseUrl}${endpoint}`)
      .pipe(catchError(this._handleApiError));
  }

  private _handleApiError(error: any) {
    console.error('API error:', error);
    return throwError(() => error);
  }

}
