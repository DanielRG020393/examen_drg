import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent {

  buscar: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() reset = new EventEmitter<void>();

  onSearch(): void {
    if (this.buscar.trim()) {
      this.search.emit(this.buscar);
    }
  }

  onReset(): void {
    this.buscar = '';
    this.reset.emit();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

}
