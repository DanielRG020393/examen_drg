import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Pokemon, PokemonListItem, Type } from '../../model/pokemon';
import { PokemonService } from '../../servicios/pokemon.service';
import { CardComponent } from '../card/card.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pokemon-list',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, FormsModule],
  templateUrl: './pokemon-list.component.html',
  styleUrl: './pokemon-list.component.css'
})
export class PokemonListComponent implements OnInit, OnDestroy {
  pokemonList: Pokemon[] = [];
  filteredPokemon: Pokemon[] = [];
  allPokemon: PokemonListItem[] = [];
  types: Type[] = [];
  selectedType: string = '';
  isLoading = false;
  offset = 0;
  limit = 20;
  hasMore = true;
  selectedPokemon: Pokemon | null = null;
  showModal = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemonTypes();
    this.loadInitialPokemon();
  }

  ngOnDestroy(): void {}

  loadPokemonTypes(): void {
    this.pokemonService.getPokemonTypes().subscribe({
      next: (types) => {
        this.types = types;
      },
      error: (error) => {
        console.error('Error loading types:', error);
      }
    });
  }

  loadInitialPokemon(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: async (response) => {
        this.allPokemon = response.results;
        this.hasMore = !!response.next;
        await this.loadPokemonDetails(this.allPokemon);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Pokémon:', error);
        this.isLoading = false;
      }
    });
  }

  async loadPokemonDetails(pokemonItems: PokemonListItem[]): Promise<void> {
    const promises = pokemonItems.map(item =>
      this.pokemonService.getPokemonByUrl(item.url).toPromise()
    );

    try {
      const pokemonDetails = await Promise.all(promises);
      const validPokemon = pokemonDetails.filter(p => p !== undefined && p !== null) as Pokemon[];

      if (this.selectedType) {
        // Cuando hay filtro, reemplazar la lista
        this.filteredPokemon = [...validPokemon];
      } else {
        // Cuando no hay filtro, agregar a la lista existente
        this.pokemonList = [...this.pokemonList, ...validPokemon];
        this.filteredPokemon = [...this.pokemonList];
      }
    } catch (error) {
      console.error('Error loading Pokémon details:', error);
    }
  }

  loadMorePokemon(): void {
    if (this.isLoading || !this.hasMore || this.selectedType) return;

    this.isLoading = true;
    this.offset += this.limit;

    this.pokemonService.getPokemonList(this.limit, this.offset).subscribe({
      next: async (response) => {
        const newPokemonItems = response.results.filter(newItem =>
          !this.allPokemon.some(existingItem => existingItem.name === newItem.name)
        );

        this.allPokemon = [...this.allPokemon, ...newPokemonItems];
        this.hasMore = !!response.next;
        await this.loadPokemonDetails(newPokemonItems);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading more Pokémon:', error);
        this.isLoading = false;
      }
    });
  }

  onTypeChange(): void {
    if (!this.selectedType) {
      this.filteredPokemon = [...this.pokemonList];
      this.hasMore = true; // Restaurar scroll infinito
      return;
    }

    this.isLoading = true;
    this.pokemonService.getPokemonByType(this.selectedType).subscribe({
      next: async (pokemonItems) => {
        // Limitar a los primeros 50 para mejor performance
        const limitedItems = pokemonItems.slice(0, 50);

        this.filteredPokemon = [];
        await this.loadPokemonDetails(limitedItems);
        this.hasMore = false; // No cargar más cuando hay filtro activo
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error filtering by type:', error);
        this.isLoading = false;
      }
    });
  }

  openModal(pokemon: Pokemon): void {
    this.selectedPokemon = pokemon;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedPokemon = null;
  }

  getTypeClass(typeName: string): string {
    const typeClasses: {[key: string]: string} = {
      normal: 'bg-secondary',
      fire: 'bg-danger',
      water: 'bg-primary',
      electric: 'bg-warning',
      grass: 'bg-success',
      ice: 'bg-info',
      fighting: 'bg-dark',
      poison: 'bg-purple',
      ground: 'bg-brown',
      flying: 'bg-sky',
      psychic: 'bg-pink',
      bug: 'bg-green',
      rock: 'bg-gray',
      ghost: 'bg-indigo',
      dragon: 'bg-orange',
      dark: 'bg-dark',
      steel: 'bg-steel',
      fairy: 'bg-pink'
    };

    return typeClasses[typeName] || 'bg-secondary';
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (this.isLoading || !this.hasMore || this.selectedType) return;

    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    // Cargar más cuando esté a 100px del final
    if (scrollPosition >= documentHeight - 100) {
      this.loadMorePokemon();
    }
  }
}
