import { NgModule } from '@angular/core';
import { PokemonCardComponent } from './cards/pokemon-card/pokemon-card.component';

@NgModule({
  imports: [
    PokemonCardComponent
  ],
  exports: [
    PokemonCardComponent
  ]
})
export class UiModule {}
