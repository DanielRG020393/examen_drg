import { Injectable } from '@angular/core';
import { Pokemon } from '../model/pokemon';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private cache = new Map<string, Pokemon>();

  constructor(private http: HttpClient) {}

  searchPokemon(nameOrId: string): Observable<Pokemon | null> {
    // Validación de entrada vacía
    if (!nameOrId.trim()) {
      return of(null);
    }

    // Normalizar entrada (minúsculas y sin espacios)
    const searchTerm = nameOrId.toLowerCase().trim();

    // Verificar caché
    if (this.cache.has(searchTerm)) {
      return of(this.cache.get(searchTerm)!);
    }

    // Hacer petición a la API
    return this.http.get<Pokemon>(`${this.apiUrl}/${searchTerm}`).pipe(
      map((pokemon) => {
        // Guardar en caché
        this.cache.set(searchTerm, pokemon);
        return pokemon;
      }),
      catchError((error) => {
        console.error('Error fetching Pokémon:', error);
        return of(null);
      })
    );
  }
}
