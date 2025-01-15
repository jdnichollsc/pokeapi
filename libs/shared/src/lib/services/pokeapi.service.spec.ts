import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { PokeApiService } from './pokeapi.service';
import { environment } from '../environments/environment';
import { mockPokemonList } from '../testing/pokemon.mock';
import { PokemonForm } from '../models/pokemon.model';

describe('PokeApiService', () => {
  let service: PokeApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PokeApiService]
    });

    service = TestBed.inject(PokeApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPokemonList', () => {
    it('should fetch pokemon list with default pagination', async () => {
      const promise = firstValueFrom(service.getPokemonList());

      const req = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon?offset=0&limit=20`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonList);

      // Mock form requests
      mockPokemonList.results.forEach(pokemon => {
        const formReq = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon-form/${pokemon.name}`);
        expect(formReq.request.method).toBe('GET');
        formReq.flush({
          name: pokemon.name,
          sprites: {
            front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.name}.png`
          }
        });
      });

      const pokemons = await promise;
      expect(pokemons.length).toBe(mockPokemonList.results.length);
      expect(pokemons[0].name).toBe(mockPokemonList.results[0].name);
    });

    it('should fetch pokemon list with custom pagination', async () => {
      const offset = 20;
      const limit = 10;

      const promise = firstValueFrom(service.getPokemonList(offset, limit));

      const req = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon?offset=${offset}&limit=${limit}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPokemonList);

      // Mock form requests
      mockPokemonList.results.forEach(pokemon => {
        const formReq = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon-form/${pokemon.name}`);
        expect(formReq.request.method).toBe('GET');
        formReq.flush({
          name: pokemon.name,
          sprites: {
            front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.name}.png`
          }
        });
      });

      const pokemons = await promise;
      expect(pokemons.length).toBe(mockPokemonList.results.length);
    });

    it('should fetch pokemon list and get form details', async () => {
      const mockForm: PokemonForm = {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon-form/1/',
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
        }
      };

      const promise = firstValueFrom(service.getPokemonList());

      // First request for pokemon list
      const listReq = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon?offset=0&limit=20`);
      expect(listReq.request.method).toBe('GET');
      listReq.flush(mockPokemonList);

      // Form requests for each pokemon
      mockPokemonList.results.forEach(pokemon => {
        const formReq = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon-form/${pokemon.name}`);
        expect(formReq.request.method).toBe('GET');
        formReq.flush(mockForm);
      });

      const pokemons = await promise;
      expect(pokemons[0].name).toBe(mockPokemonList.results[0].name);
      expect(pokemons[0].imageUrl).toBe(mockForm.sprites?.front_default);
    });

    it('should handle errors when fetching pokemon list', async () => {
      const errorMessage = 'Failed to fetch pokemon list';
      let thrownError: HttpErrorResponse | null = null;

      const promise = firstValueFrom(service.getPokemonList());
      const req = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon?offset=0&limit=20`);
      req.error(new ErrorEvent('Network error', { message: errorMessage }), {
        status: 404,
        statusText: errorMessage
      });

      try {
        await promise;
      } catch (error: any) {
        thrownError = error;
      }

      expect(thrownError).toBeTruthy();
      expect(thrownError?.statusText).toBe(errorMessage);
    });
  });

  describe('getPokemonForm', () => {
    it('should fetch pokemon form details', async () => {
      const pokemonName = 'bulbasaur';
      const mockForm: PokemonForm = {
        name: pokemonName,
        url: `https://pokeapi.co/api/v2/pokemon-form/1/`,
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
        }
      };

      const promise = firstValueFrom(service.getPokemonForm(pokemonName));

      const req = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon-form/${pokemonName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockForm);

      const form = await promise;
      expect(form).toEqual(mockForm);
    });

    it('should handle errors when fetching pokemon form', async () => {
      const pokemonName = 'bulbasaur';
      const errorMessage = 'Failed to fetch pokemon form';
      let thrownError: HttpErrorResponse | null = null;

      const promise = firstValueFrom(service.getPokemonForm(pokemonName));
      const req = httpTestingController.expectOne(`${environment.pokeApiUrl}/pokemon-form/${pokemonName}`);
      req.error(new ErrorEvent('Network error', { message: errorMessage }), {
        status: 404,
        statusText: errorMessage
      });

      try {
        await promise;
      } catch (error: any) {
        thrownError = error;
      }

      expect(thrownError).toBeTruthy();
      expect(thrownError?.statusText).toBe(errorMessage);
    });
  });
}); 