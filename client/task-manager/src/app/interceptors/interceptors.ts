// import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
// import { inject } from '@angular/core';
// import { Router } from '@angular/router';
// import { catchError, throwError } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = sessionStorage.getItem('token');
//   if (token) {
//     req = req.clone({
//       setHeaders: { Authorization: `Bearer ${token}` }
//     });
//   }
//   return next(req);
// };

// export const errorInterceptor: HttpInterceptorFn = (req, next) => {
//   const router = inject(Router);

//   return next(req).pipe(
//     catchError((error: HttpErrorResponse) => {

//       if (error.status === 401) {
//         alert('שגיאת הרשאה (401): עליך להתחבר מחדש למערכת.');
//         sessionStorage.removeItem('token');
//         router.navigate(['/register']);
//       }

//       else if (error.status === 403) {
//         alert('⛔ אין לך הרשאות לבצע פעולה זו!');
//       }

//       else if (error.status === 404) {
//         alert('🔍 הנתון שחיפשת לא נמצא במערכת (404).');
//       }

//       else if (error.status === 500) {
//         alert('🔥 אופס... יש תקלה בשרת. נסה שוב מאוחר יותר.');
//       }

//       else if (error.status === 0) {
//         alert('⚠️ אין תקשורת לשרת. בדוק את החיבור שלך.');
//       }

//       return throwError(() => error);
//     })
//   );
// };

import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service'; // <--- ייבוא

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService); // <--- הזרקה

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        toast.error('החיבור פג תוקף, אנא התחבר מחדש 🔒'); // <--- שינוי
        sessionStorage.removeItem('token');
        router.navigate(['/register']);
      }

      else if (error.status === 403) {
        toast.error('אין לך הרשאות לבצע פעולה זו! ✋');
      }

      else if (error.status === 404) {
        toast.info('הנתון לא נמצא במערכת 🔍');
      }

      else if (error.status === 500) {
        toast.error('תקלה בשרת, נסה שוב מאוחר יותר 🔥');
      }

      else if (error.status === 0) {
        toast.error('אין תקשורת. בדוק את האינטרנט שלך ⚠️');
      }

      return throwError(() => error);
    })
  );
};