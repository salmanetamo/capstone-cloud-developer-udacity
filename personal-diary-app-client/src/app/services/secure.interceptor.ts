import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, filter, mergeMap } from 'rxjs/operators';

@Injectable()
export class SecureInterceptor implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.indexOf('/dev/') > -1) {
      return this.auth.idTokenClaims$.pipe(
        filter(token => {
          console.log(token?.__raw);
          return typeof token?.__raw === 'string'
        }),
        mergeMap(token => {
          const tokenReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token?.__raw}` }
          });
          return next.handle(tokenReq);
        }),
        catchError(err => throwError(err))
      );
    }
    return next.handle(req);
  }
}
