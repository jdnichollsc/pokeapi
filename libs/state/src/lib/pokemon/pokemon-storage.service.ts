import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Pokemon } from './pokemon.model';

@Injectable({ providedIn: 'root' })
export class PokemonStorageService {
  private readonly POKEMON_LIST_KEY = 'pokemon-list';
  private readonly platformId = inject(PLATFORM_ID);

  savePokemonList(pageKey: string, pokemons: Pokemon[]): void {
    if (isPlatformBrowser(this.platformId)) {
      const existingData = this.getPokemonListCache() || {};
      existingData[pageKey] = pokemons;
      localStorage.setItem(this.POKEMON_LIST_KEY, JSON.stringify(existingData));
    }
  }

  getPokemonListFromCache(pageKey: string): Pokemon[] | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const cache = this.getPokemonListCache();
    return cache?.[pageKey] || null;
  }

  private getPokemonListCache(): { [pageKey: string]: Pokemon[] } | null {
    if (!isPlatformBrowser(this.platformId)) return null;

    const cacheString = localStorage.getItem(this.POKEMON_LIST_KEY);
    if (!cacheString) return null;

    try {
      return JSON.parse(cacheString);
    } catch {
      return null;
    }
  }
} 