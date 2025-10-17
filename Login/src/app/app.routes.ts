import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: HomeComponent },
  {
    path: 'Administrador',
    loadChildren: () =>
      import('./administrador/administrador.module').then((m) => m.AdministradorModule),
  },
  { path: '**', redirectTo: 'login' },
];
