import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../model/pokemon';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() pokemon: Pokemon | null = null;
  isFlipped = false;

  toggleFlip(): void {
    this.isFlipped = !this.isFlipped;
  }

  getStatValue(statName: string): number {
    if (!this.pokemon) return 0;

    const stat = this.pokemon.stats.find(
      (s) => s.stat.name === statName.toLowerCase()
    );
    return stat ? stat.base_stat : 0;
  }

  getTypeClass(typeName: string): string {
    const typeClasses: { [key: string]: string } = {
      normal: 'bg-secondary',
      fire: 'bg-danger',
      water: 'bg-primary',
      electric: 'bg-warning',
      grass: 'bg-success',
      ice: 'bg-info',
      fighting: 'bg-dark',
      poison: 'bg-purple',
      ground: 'bg-brown',
      flying: 'bg-sky',
      psychic: 'bg-pink',
      bug: 'bg-green',
      rock: 'bg-gray',
      ghost: 'bg-indigo',
      dragon: 'bg-orange',
      dark: 'bg-dark',
      steel: 'bg-steel',
      fairy: 'bg-pink',
    };

    return typeClasses[typeName] || 'bg-secondary';
  }
}
