import { createReducer, on } from '@ngrx/store';

import { Pokemon } from './pokemon.model';
import { pokemonActions } from './pokemon.actions';
import { produceOn } from '../state.utils';

export interface PokemonState {
  list: Pokemon[];
  currentPage: number;
  pageSize: number;
  loading: boolean;
  error: string | null;
  totalCount: number;
}

export const initialState: PokemonState = {
  list: [],
  currentPage: 0,
  pageSize: 20,
  loading: false,
  error: null,
  totalCount: 0,
};

export const pokemonReducer = createReducer(
  initialState,
  
  // Load Pokemon List
  produceOn(pokemonActions.loadPokemonList, (stateDraft) => {
    stateDraft.loading = true;
    stateDraft.error = null;
  }),
  
  produceOn(pokemonActions.loadPokemonListSuccess, (stateDraft, { pokemons }) => {
    stateDraft.list = [...stateDraft.list, ...pokemons];
    stateDraft.loading = false;
  }),
  
  produceOn(pokemonActions.loadPokemonListFailure, (stateDraft, { error }) => {
    stateDraft.loading = false;
    stateDraft.error = error;
  }),
  
  // Pagination
  produceOn(pokemonActions.setCurrentPage, (stateDraft, { page }) => {
    stateDraft.currentPage = page;
  }),
  
  produceOn(pokemonActions.setPageSize, (stateDraft, { pageSize }) => {
    stateDraft.pageSize = pageSize;
  })
);
