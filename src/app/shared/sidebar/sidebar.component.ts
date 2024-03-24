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

  // Define los elementos del menú del sidebar
  menuItems = [
    { routerLink: '/recepcion', iconClass: 'fas fa-sign-in-alt card-icon', text: 'Recepción' },
    { routerLink: '/inicio', iconClass: 'fas fa-home card-icon', text: 'Inicio' },
    { routerLink: '/clientes', iconClass: 'fas fa-user card-icon', text: 'Clientes' },
    { routerLink: '/mascotas', iconClass: 'fas fa-paw card-icon', text: 'Mascotas' },
    { routerLink: '/veterinarians', iconClass: 'fas fa-user-md card-icon', text: 'Veterinarios' },
    { routerLink: '/consultorio', iconClass: 'fas fa-notes-medical card-icon', text: 'Consultas' },
    { routerLink: '/medications', iconClass: 'fas fa-prescription-bottle-alt card-icon', text: 'Medicamentos' }
  ];


}