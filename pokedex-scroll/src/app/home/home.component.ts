import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../model/pokemon';
import { PokemonService } from '../servicios/pokemon.service';
import { BuscadorComponent } from '../componentes/buscador/buscador.component';
import { CardComponent } from '../componentes/card/card.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule, BuscadorComponent, CardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  pokemon: Pokemon | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private pokemonService: PokemonService) {}

  onSearch(term: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.pokemon = null;

    this.pokemonService.searchPokemon(term).subscribe({
      next: (pokemon) => {
        this.isLoading = false;
        if (pokemon) {
          this.pokemon = pokemon;
        } else {
          this.errorMessage =
            'No se encontró ningún Pokémon con ese nombre o ID';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Error al buscar el Pokémon. Intenta nuevamente.';
      },
    });
  }

  onReset(): void {
    this.pokemon = null;
    this.errorMessage = '';
    this.isLoading = false;
  }
}
