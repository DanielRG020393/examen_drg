import { Injectable } from '@angular/core';
import { CanActivate, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClienteguardGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean | UrlTree> {
    const storedUser = localStorage.getItem('currentUser');
    if (!storedUser) {
      this.logoutAndRedirect();
      return of(false);
    }

    const user = JSON.parse(storedUser);
    const dat = {
      correo: user.usu_login,
      token: localStorage.getItem('authToken'),
    };

    return this.auth.perfil(dat).pipe(
      map((response) => {
        // PERFIL 2 = CLIENTE (Roberto)
        if (response['id_perfil'] == 2) {
          return true;
        }
        this.logoutAndRedirect();
        return false;
      }),
      catchError((error) => {
        console.error('Error fetching profile data:', error);
        this.logoutAndRedirect();
        return of(false);
      })
    );
  }

  private logoutAndRedirect(): void {
    const storedUser = localStorage.getItem('currentUser');
    const dat = {
      correo: storedUser ? JSON.parse(storedUser).usu_login : '',
      token: localStorage.getItem('authToken'),
    };

    this.auth.logout(dat).subscribe({
      next: () => {
        this.clearStorage();
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        console.error('Error during logout:', err);
        this.clearStorage();
        this.router.navigateByUrl('/login');
      },
    });
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
  }
}
