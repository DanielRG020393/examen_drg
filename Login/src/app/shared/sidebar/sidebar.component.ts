import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

interface MenuItem {
  icon: string;
  label: string;
  tag: string;
  url: string;
  children?: MenuItem[];
  isOpen?: boolean;
}
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @Input() isSidebarCollapsed = false;
  @Output() sidebarToggle = new EventEmitter<void>();

  nombre!: String;
  tipo!: String;
  menuItems: MenuItem[] = [];
  per: any;

  constructor(private router: Router, private auth: AuthService) {}

  async ngOnInit(): Promise<void> {
    // Obtener usuario desde localStorage
    const storedUser = localStorage.getItem('currentUser');
    console.log('Datos en localStorage:', storedUser);

    if (storedUser) {
      const user = JSON.parse(storedUser);
      console.log('Usuario parseado:', user);
      this.nombre = user.usu_nombre;
      this.tipo = user.tipo;
      this.per = user.id_perfil;

      console.log('Valores asignados:', {
        nombre: this.nombre,
        tipo: this.tipo,
        per: this.per,
      });
    }

    if (this.per == 1) {
      // Menú exclusivo para perfil 1 - Administrador
      this.menuItems = [
        {
          icon: 'fa fa-building-wheat',
          label: 'Menú Admin',
          isOpen: true,
          children: [
            {
              icon: 'fas fa-circle',
              label: 'Subm 1',
              tag: '',
              url: '',
            },
            {
              icon: 'fas fa-circle',
              label: 'Subm 2',
              tag: '',
              url: '',
            },
          ],
          tag: '',
          url: '',
        },
      ];
    } else {
      if (this.per == 2) {
        // Menú exclusivo para perfil 2 - Cliente
        this.menuItems = [
          {
            icon: 'fa fa-building-wheat',
            label: 'Menú Cliente',
            isOpen: true,
            children: [
              {
                icon: 'fas fa-circle',
                label: 'Sub-C 1',
                tag: '',
                url: '',
              },
            ],
            tag: '',
            url: '',
          },
        ];
      }
    }
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  toggleMenuItem(selectedItem: any) {
    this.menuItems.forEach((item) => {
      if (item !== selectedItem) {
        item.isOpen = false;
      }
    });
    selectedItem.isOpen = !selectedItem.isOpen;
  }

  logout() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const dat = {
        correo: user.usu_login,
        token: localStorage.getItem('authToken'),
      };

      this.auth.logout(dat).subscribe(
        (res) => {
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
          this.router.navigateByUrl('/login');
        },
        (err) => {
          console.log(err);
          // Limpiar localStorage incluso si hay error
          localStorage.removeItem('currentUser');
          localStorage.removeItem('authToken');
          this.router.navigateByUrl('/login');
        }
      );
    }
  }
}
