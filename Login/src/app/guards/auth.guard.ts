import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    // Verificar en localStorage primero
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (!storedUser || !storedToken) {
      this.clearStorageAndRedirect();
      return of(false);
    }

    // VERIFICAR EXPIRACIÓN DEL TOKEN
    if (this.isTokenExpired(storedToken)) {
      console.log('Token expirado, redirigiendo al login');
      this.clearStorageAndRedirect();
      return of(false);
    }

    const user = JSON.parse(storedUser);

    return this.auth.busquedadetoken(user.usu_login, storedToken).pipe(
      map((response) => {
        if (!response) {
          this.clearStorageAndRedirect();
          return false;
        }
        return true;
      }),
      catchError(() => {
        this.clearStorageAndRedirect();
        return of(false);
      })
    );
  }

  // MÉTODO PARA VERIFICAR SI EL TOKEN HA EXPIRADO
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (error) {
      console.error('Error verificando expiración del token:', error);
      return true;
    }
  }

  private clearStorageAndRedirect(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.router.navigateByUrl('/login');
  }
}
