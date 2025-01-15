import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, map, Observable, switchMap, of } from 'rxjs';

import { environment } from '../environments/environment';
import { Pokemon, PokemonForm, PokemonListResponse } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.pokeApiUrl;

  /**
   * Get paginated list of pokemon with their form images
   */
  getPokemonList(offset: number = 0, limit: number = 20): Observable<Pokemon[]> {
    return this.http
      .get<PokemonListResponse>(`${this.baseUrl}/pokemon`, {
        params: { offset, limit }
      })
      .pipe(
        switchMap(response => {
          const detailsRequests = response.results.map(pokemon => 
            forkJoin({
              basic: of(pokemon),
              form: this.http.get<PokemonForm>(`${this.baseUrl}/pokemon-form/${pokemon.name}`)
            })
          );
          return forkJoin(detailsRequests);
        }),
        map(pokemonDataArray => 
          pokemonDataArray.map(({ basic, form }) => ({
            ...basic,
            imageUrl: form.sprites?.front_default
          }))
        )
      );
  }

  /**
   * Get Pokemon form details by name
   */
  getPokemonForm(name: string): Observable<PokemonForm> {
    return this.http.get<PokemonForm>(`${this.baseUrl}/pokemon-form/${name}`);
  }
}