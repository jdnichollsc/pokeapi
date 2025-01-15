import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { PokeApiService } from '@pokeapi/shared';

import { pokemonActions } from './pokemon.actions';
import { PokemonStorageService } from './pokemon-storage.service';

@Injectable()
export class PokemonEffects {
  loadPokemonList$;

  constructor(
    private readonly actions$: Actions,
    private readonly pokeApiService: PokeApiService,
    private readonly storageService: PokemonStorageService
  ) {
    this.loadPokemonList$ = createEffect(() =>
      this.actions$.pipe(
        ofType(pokemonActions.loadPokemonList),
        mergeMap(({ offset, limit }) => {
          const pageKey = `${offset}_${limit}`;
          const cachedList = this.storageService.getPokemonListFromCache(pageKey);

          if (cachedList) {
            return of(pokemonActions.loadPokemonListSuccess({ pokemons: cachedList }));
          }

          return this.pokeApiService.getPokemonList(offset, limit).pipe(
            map(pokemons => {
              this.storageService.savePokemonList(pageKey, pokemons);
              return pokemonActions.loadPokemonListSuccess({ pokemons });
            }),
            catchError(error =>
              of(pokemonActions.loadPokemonListFailure({ error: error.message }))
            )
          );
        })
      )
    );
  }
}
