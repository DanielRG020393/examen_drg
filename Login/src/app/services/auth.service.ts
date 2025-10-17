import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';

export interface ProfileResponse {
  id_perfil: number;
}

export interface LoginResponse {
  usu_login: string;
  token: string;
  usu_nombre: string;
  fecha: string;
  home: string;
  id_perfil: number;
  tipo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Usuarios predefinidos
  private usuarios = [
    {
      correo: 'Daniel',
      password: 'admin123',
      usu_nombre: 'Daniel Ramírez G.',
      tipo: 'Administrador',
      id_perfil: 1, // Administrador
      home: '/Administrador/Inicio',
    },
    {
      correo: 'Roberto',
      password: 'cliente123',
      usu_nombre: 'Roberto Torres S.',
      tipo: 'Cliente',
      id_perfil: 2, // Cliente
      home: '/Cliente/Inicio',
    },
  ];

  constructor() {}

  login(dat: any): Observable<any> {
    // Simular llamada a API
    return of(this.simularLogin(dat)).pipe(
      map((resp) => {
        return resp;
      })
    );
  }

  private simularLogin(dat: any): LoginResponse | null {
    const usuario = this.usuarios.find(
      (user) => user.correo === dat.correo && user.password === dat.password
    );

    if (usuario) {
      // Generar token JWT simulado
      const token = this.generarTokenSimulado(usuario);

      const response: LoginResponse = {
        usu_login: usuario.correo,
        token: token,
        usu_nombre: usuario.usu_nombre,
        fecha: new Date().toISOString(),
        home: usuario.home,
        id_perfil: usuario.id_perfil,
        tipo: usuario.tipo,
      };

      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(response));
      localStorage.setItem('authToken', token);

      return response;
    }

    return null;
  }

  private generarTokenSimulado(usuario: any): string {
    // Simular un token JWT (en realidad es solo un string base64)
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(
      JSON.stringify({
        sub: usuario.correo,
        name: usuario.usu_nombre,
        perf: usuario.id_perfil,
        tipo: usuario.tipo,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 120, //2 min
      })
    );

    return `${header}.${payload}.simulated_signature`;
  }

  busquedadetoken(correo: any, id: any): Observable<any> {
    // Verificar token en localStorage
    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('authToken');

    if (storedUser && storedToken === id) {
      const user = JSON.parse(storedUser);
      // Verificar si el token no ha expirado (simulación básica)
      try {
        const payload = JSON.parse(atob(id.split('.')[1]));
        if (payload.exp > Math.floor(Date.now() / 1000)) {
          return of(user);
        }
      } catch (e) {
        console.error('Error parsing token:', e);
      }
    }

    return of(null);
  }

  logout(dat: any): Observable<any> {
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    return of({ success: true });
  }

  perfil(dat: any): Observable<ProfileResponse> {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return of({ id_perfil: user.id_perfil });
    }
    return of({ id_perfil: 0 });
  }
}
