import type { Meta, StoryObj } from '@storybook/angular';
import { PokemonCardComponent } from './pokemon-card.component';

const meta: Meta<PokemonCardComponent> = {
  component: PokemonCardComponent,
  title: 'PokemonCard',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<PokemonCardComponent>;

export const Primary: Story = {
  args: {
    pokemon: {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
      imageUrl: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    }
  }
}; 