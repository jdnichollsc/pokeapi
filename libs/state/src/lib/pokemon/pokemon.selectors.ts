import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PokemonState} from './pokemon.reducer';

export const selectPokemonState = createFeatureSelector<PokemonState>('pokemon');

export const selectPokemonList = createSelector(
  selectPokemonState,
  (state) => state.list
);

export const selectCurrentPage = createSelector(
  selectPokemonState,
  (state) => state.currentPage
);

export const selectPageSize = createSelector(
  selectPokemonState,
  (state) => state.pageSize
);

export const selectLoading = createSelector(
  selectPokemonState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectPokemonState,
  (state) => state.error
);

export const selectHasMorePokemons = createSelector(
  selectPokemonState,
  (state) => !state.loading && state.list.length > 0
);

export const pokemonSelectors = {
  selectPokemonList,
  selectCurrentPage,
  selectPageSize,
  selectLoading,
  selectError,
  selectHasMorePokemons,
};
