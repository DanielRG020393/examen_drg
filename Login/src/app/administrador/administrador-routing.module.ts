import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorComponent } from './administrador.component';
import { AuthGuard } from '../guards/auth.guard';
import { AdministradorguardGuard } from '../guards/administradorguard.guard';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  {
    path: '', // Administrador
    redirectTo: 'Inicio',
    pathMatch: 'full',
  },
  {
    path: 'Inicio', // Administrador/Inicio
    component: AdministradorComponent,
    canActivate: [AuthGuard, AdministradorguardGuard],
    children: [
      {
        path: '',
        component: InicioComponent,
        outlet: 'Secc',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministradorRoutingModule {}
