import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isSmallSidebar: boolean = false;
  @Input() isSidebarOpen: boolean = false;

  menuItems = [
    { routerLink: '/recepcion', iconClass: 'fas fa-sign-in-alt', text: 'Recepción' },
    { routerLink: '/inicio', iconClass: 'fas fa-home', text: 'Inicio' },
    { routerLink: '/clientes', iconClass: 'fas fa-user', text: 'Clientes' },
    { routerLink: '/mascotas', iconClass: 'fas fa-paw', text: 'Mascotas' },
    { routerLink: '/veterinarians', iconClass: 'fas fa-user-md', text: 'Veterinarios' },
    { routerLink: '/consultas', iconClass: 'fas fa-notes-medical', text: 'Consultas' },
    { routerLink: '/atencionestetica', iconClass: 'fas fa-spa', text: 'Estética' },
    { routerLink: '/catalogoMedicamentos', iconClass: 'fas fa-prescription-bottle-alt', text: 'Medicamentos' },
    { routerLink: '/venta-mostrador', iconClass: 'fas fa-cash-register', text: 'Venta al Mostrador' }
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth <= 768) {
      this.isSidebarOpen = false;
  
    }  }  }
  