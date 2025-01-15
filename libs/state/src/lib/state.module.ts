import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { PokemonEffects } from './pokemon/pokemon.effects';
import { pokemonReducer } from './pokemon/pokemon.reducer';
import { PokemonStorageService } from './pokemon/pokemon-storage.service';

export interface AppState {
  pokemon: ReturnType<typeof pokemonReducer>;
}

export const reducers = {
  pokemon: pokemonReducer,
};

export const effects = [PokemonEffects];

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot(effects),
  ],
  providers: [PokemonStorageService],
})
export class StateModule {}
