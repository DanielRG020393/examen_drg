import { Injectable } from '@angular/core';
import {
  Pokemon,
  PokemonListItem,
  PokemonListResponse,
  Type,
  TypeResponse,
} from '../model/pokemon';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private typesUrl = 'https://pokeapi.co/api/v2/type';
  private cache = new Map<string, Pokemon>();
  private pokemonCache = new Map<string, Pokemon>();

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

  getPokemonList(
    limit: number = 20,
    offset: number = 0
  ): Observable<PokemonListResponse> {
    return this.http.get<PokemonListResponse>(
      `${this.apiUrl}?limit=${limit}&offset=${offset}`
    );
  }

  getPokemonByUrl(url: string): Observable<Pokemon> {
    if (this.pokemonCache.has(url)) {
      return of(this.pokemonCache.get(url)!);
    }

    return this.http.get<Pokemon>(url).pipe(
      map((pokemon) => {
        this.pokemonCache.set(url, pokemon);
        return pokemon;
      })
    );
  }

  getPokemonTypes(): Observable<Type[]> {
    return this.http
      .get<TypeResponse>(this.typesUrl)
      .pipe(
        map((response) =>
          response.results.filter(
            (type) => !['shadow', 'unknown'].includes(type.name)
          )
        )
      );
  }

  getPokemonByType(type: string): Observable<PokemonListItem[]> {
    return this.http.get<any>(`${this.typesUrl}/${type}`).pipe(
      map((response) => {
        return response.pokemon.map((item: any) => ({
          name: item.pokemon.name,
          url: item.pokemon.url,
        }));
      })
    );
  }
}
