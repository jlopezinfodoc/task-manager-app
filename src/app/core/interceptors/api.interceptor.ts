import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EnvironmentService } from '../services/environment.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor(private environmentService: EnvironmentService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Log de la request en modo debug
    this.environmentService.log('debug', 'HTTP Request:', {
      method: req.method,
      url: req.url,
      headers: req.headers.keys()
    });

    // Clonar la request para agregar headers comunes
    const modifiedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'X-App-Version': this.environmentService.version,
        'X-Environment': this.environmentService.isProduction ? 'production' : 'development'
      }
    });

    return next.handle(modifiedReq).pipe(
      tap(event => {
        // Log de response exitosa en modo debug
        this.environmentService.log('debug', 'HTTP Response:', {
          type: event.type,
          url: req.url
        });
      }),
      catchError((error: HttpErrorResponse) => {
        // Log de errores
        this.environmentService.log('error', 'HTTP Error:', {
          status: error.status,
          message: error.message,
          url: req.url,
          method: req.method
        });

        // Transformar errores para mejor UX
        let errorMessage = 'An unexpected error occurred';

        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else if (error.status >= 400 && error.status < 500) {
          errorMessage = error.error?.message || 'Invalid request. Please check your data.';
        } else if (error.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
