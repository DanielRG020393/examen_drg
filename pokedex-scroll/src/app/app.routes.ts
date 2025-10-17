import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PokemonListComponent } from './componentes/pokemon-list/pokemon-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'pokedex', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'pokedex', component: PokemonListComponent },
  { path: '**', redirectTo: 'pokedex' },
];
