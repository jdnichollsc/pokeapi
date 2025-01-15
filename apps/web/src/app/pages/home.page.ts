import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, pokemonActions, pokemonSelectors, Pokemon } from '@pokeapi/state';
import { Observable, withLatestFrom, take } from 'rxjs';
import { InfiniteScrollDirective } from '@pokeapi/shared';
import { UiModule } from '@pokeapi/ui';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, InfiniteScrollDirective, UiModule],
  templateUrl: './home.page.html',
})
export default class HomePage {
  pokemonList$: Observable<Pokemon[]>;
  loading$: Observable<boolean>;

  constructor(private readonly store: Store<AppState>) {
    this.pokemonList$ = this.store.select(pokemonSelectors.selectPokemonList);
    this.loading$ = this.store.select(pokemonSelectors.selectLoading);

    // Load initial data
    this.loadNextPage();
  }

  onScroll(): void {
    this.store.select(pokemonSelectors.selectLoading)
      .pipe(
        take(1),
        withLatestFrom(
          this.store.select(pokemonSelectors.selectCurrentPage),
          this.store.select(pokemonSelectors.selectPageSize)
        )
      )
      .subscribe(([loading, page, size]) => {
        if (!loading) {
          this.store.dispatch(pokemonActions.loadPokemonList({
            offset: page * size,
            limit: size
          }));
          this.store.dispatch(pokemonActions.setCurrentPage({ page: page + 1 }));
        }
      });
  }

  private loadNextPage(): void {
    this.store.dispatch(pokemonActions.loadPokemonList({
      offset: 0,
      limit: 20
    }));
  }
}
