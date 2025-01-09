import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../servicios/shared-data.service';
import { RegistroClienteMascotaModalComponent } from '../modal/registro-cliente-mascota-modal/registro-cliente-mascota-modal.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MascotasModule } from '../../mascotas/mascotas.module';
import { ModalService } from '../../servicios/modal.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule,MascotasModule],
  providers:[ToastrService,ModalService,],

})
export class NavbarComponent {
  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }
}