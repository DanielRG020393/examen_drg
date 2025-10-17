import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteComponent } from './cliente.component';
import { AuthGuard } from '../guards/auth.guard';
import { ClienteguardGuard } from '../guards/clienteguard.guard';
import { InicioComponent } from './inicio/inicio.component';

const routes: Routes = [
  {
    path: '', // /Cliente
    redirectTo: 'Inicio',
    pathMatch: 'full'
  },
  {
    path: 'Inicio', // /Cliente/Inicio
    component: ClienteComponent,
    canActivate: [AuthGuard, ClienteguardGuard],
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
export class ClienteRoutingModule {}
