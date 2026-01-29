import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        alert('שגיאת הרשאה (401): עליך להתחבר מחדש למערכת.');
        sessionStorage.removeItem('token');
        router.navigate(['/register']);
      }

      else if (error.status === 403) {
        alert('⛔ אין לך הרשאות לבצע פעולה זו!');
      }

      else if (error.status === 404) {
        alert('🔍 הנתון שחיפשת לא נמצא במערכת (404).');
      }

      else if (error.status === 500) {
        alert('🔥 אופס... יש תקלה בשרת. נסה שוב מאוחר יותר.');
      }

      else if (error.status === 0) {
        alert('⚠️ אין תקשורת לשרת. בדוק את החיבור שלך.');
      }

      return throwError(() => error);
    })
  );
};