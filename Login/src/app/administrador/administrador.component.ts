import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-administrador',
  imports: [CommonModule, SidebarComponent, RouterModule],
  templateUrl: './administrador.component.html',
  styleUrl: './administrador.component.css',
})
export class AdministradorComponent {
  isSidebarCollapsed = false;

  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  onActive() {
    window.scroll(0, 0);
  }
}
