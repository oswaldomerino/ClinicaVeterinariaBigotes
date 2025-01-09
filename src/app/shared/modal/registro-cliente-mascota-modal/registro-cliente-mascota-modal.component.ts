import { Component } from '@angular/core';


import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClienteDetalleComponent } from '../../../clientes/cliente-detalle/cliente-detalle.component';
import { ClientesModule } from '../../../clientes/clientes.module';
import { MascotasListaComponent } from '../../../mascotas/mascotas-lista/mascotas-lista.component';
import { MascotasModule } from '../../../mascotas/mascotas.module';
import { SharedDataService } from '../../../servicios/shared-data.service';




@Component({
  selector: 'app-registro-cliente-mascota-modal',
  standalone: true,
   imports: [
       CommonModule,ReactiveFormsModule,FormsModule,NgbModule,
       ClienteDetalleComponent,
       ClientesModule,
       
       MascotasModule,
       MascotasListaComponent
     
   ],
  templateUrl: './registro-cliente-mascota-modal.component.html',
  styleUrl: './registro-cliente-mascota-modal.component.css'
})
export class RegistroClienteMascotaModalComponent {
  mostrarFormulario?: boolean;
  mostrarFormularioMascota?:boolean;
  
  constructor(private clienteService: SharedDataService, public activeModal: NgbActiveModal) {
    this.clienteService.mostrarFormularioObservable.subscribe(mostrar => this.mostrarFormulario = mostrar);
    this.clienteService.mostrarFormularioMascotaObservable.subscribe(mostrar => this.mostrarFormularioMascota = mostrar);
}

closeModal() {
  this.activeModal.close(); // Cierra el modal
}

ngOnInit(): void {

}
  
}