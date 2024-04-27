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

  subMenuState: { [key: string]: boolean } = {};

  toggleSubMenu(option: string): void {
    this.subMenuState[option] = !this.subMenuState[option];
  }

  isSubMenuOpen(option: string): boolean {
    return this.subMenuState[option];
  }


  // sidebar.component.ts
toggleSidebar(): void {
  this.isSmallSidebar = !this.isSmallSidebar;
}
menuItems = [
  // Sección de Operaciones Generales
  { routerLink: '/recepcion', iconClass: 'fas fa-sign-in-alt card-icon', text: 'Recepción' },
  { routerLink: '/inicio', iconClass: 'fas fa-home card-icon', text: 'Inicio' },
  { routerLink: '/clientes', iconClass: 'fas fa-user card-icon', text: 'Clientes' },
  { routerLink: '/mascotas', iconClass: 'fas fa-paw card-icon', text: 'Mascotas' },
  
  // Sección de Servicios Veterinarios
  { routerLink: '/veterinarians', iconClass: 'fas fa-user-md card-icon', text: 'Veterinarios' },
  { routerLink: '/consultas', iconClass: 'fas fa-notes-medical card-icon', text: 'Consultas' },
  { routerLink: '/atencionestetica', iconClass: 'fas fa-spa card-icon', text: 'Estética' },

  // Sección de Productos
  { routerLink: '/catalogoMedicamentos', iconClass: 'fas fa-prescription-bottle-alt card-icon', text: 'Medicamentos' },

  // Sección de Ventas
  { routerLink: '/venta-mostrador', iconClass: 'fas fa-cash-register card-icon', text: 'Venta al Mostrador' }
];



}