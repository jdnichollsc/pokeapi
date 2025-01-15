import { createActionGroup, props } from '@ngrx/store';
import { Pokemon } from './pokemon.model';

export const pokemonActions = createActionGroup({
  source: 'Pokemon',
  events: {
    // Load Pokemon List
    'Load Pokemon List': props<{ offset: number; limit: number }>(),
    'Load Pokemon List Success': props<{ pokemons: Pokemon[] }>(),
    'Load Pokemon List Failure': props<{ error: string }>(),
    
    // Pagination
    'Set Current Page': props<{ page: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),
  },
});
