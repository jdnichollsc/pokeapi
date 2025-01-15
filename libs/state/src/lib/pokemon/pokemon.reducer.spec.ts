import { mockPokemon } from '@pokeapi/shared';
import { describe, it, expect } from 'vitest';

import { pokemonReducer, initialState, PokemonState } from './pokemon.reducer';
import { pokemonActions } from './pokemon.actions';

describe('Pokemon Reducer', () => {
  describe('Initial State', () => {
    it('should return the initial state', () => {
      const action = { type: 'NOOP' } as any;
      const state = pokemonReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('Load Pokemon List', () => {
    it('should set loading to true when loading pokemon list', () => {
      const action = pokemonActions.loadPokemonList({ offset: 0, limit: 20 });
      const state = pokemonReducer(initialState, action);

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should update state with pokemon list on success', () => {
      const action = pokemonActions.loadPokemonListSuccess({ pokemons: [mockPokemon] });
      const state = pokemonReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.list).toEqual([mockPokemon]);
      expect(state.error).toBeNull();
    });

    it('should append new pokemon to existing list on success', () => {
      const existingState: PokemonState = {
        ...initialState,
        list: [mockPokemon]
      };

      const newPokemon: typeof mockPokemon = {
        ...mockPokemon,
        name: 'charmander',
        url: 'https://pokeapi.co/api/v2/pokemon/4/',
        imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png'
      };

      const action = pokemonActions.loadPokemonListSuccess({ pokemons: [newPokemon] });
      const state = pokemonReducer(existingState, action);

      expect(state.list).toHaveLength(2);
      expect(state.list).toContainEqual(mockPokemon);
      expect(state.list).toContainEqual(newPokemon);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should set error on failure', () => {
      const error = 'Failed to load pokemon';
      const action = pokemonActions.loadPokemonListFailure({ error });
      const state = pokemonReducer(initialState, action);

      expect(state.loading).toBe(false);
      expect(state.error).toBe(error);
      expect(state.list).toEqual([]);
    });
  });

  describe('Pagination', () => {
    it('should update current page', () => {
      const page = 2;
      const action = pokemonActions.setCurrentPage({ page });
      const state = pokemonReducer(initialState, action);

      expect(state.currentPage).toBe(page);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should update page size', () => {
      const pageSize = 50;
      const action = pokemonActions.setPageSize({ pageSize });
      const state = pokemonReducer(initialState, action);

      expect(state.pageSize).toBe(pageSize);
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should maintain list when updating pagination', () => {
      const stateWithList = pokemonReducer(
        initialState,
        pokemonActions.loadPokemonListSuccess({ pokemons: [mockPokemon] })
      );

      const finalState = pokemonReducer(
        stateWithList,
        pokemonActions.setCurrentPage({ page: 2 })
      );

      expect(finalState.list).toEqual([mockPokemon]);
      expect(finalState.currentPage).toBe(2);
    });
  });
}); 