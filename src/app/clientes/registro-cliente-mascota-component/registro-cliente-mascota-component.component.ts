import { Component } from '@angular/core';
import { SharedDataService } from '../../servicios/shared-data.service';

import { ClienteFormularioComponent } from '../cliente-formulario/cliente-formulario.component';

import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClienteDetalleComponent } from '../cliente-detalle/cliente-detalle.component';

import { ClientesModule } from '../clientes.module';
import { MascotasModule } from '../../mascotas/mascotas.module';
import { MascotaFormularioComponent } from '../../mascotas/mascota-formulario/mascota-formulario.component';
import { MascotasListaComponent } from '../../mascotas/mascotas-lista/mascotas-lista.component';

@Component({
  selector: 'app-registro-cliente-mascota-component',
  standalone: true,
    imports: [
      CommonModule,ReactiveFormsModule,FormsModule,NgbModule,
      ClienteDetalleComponent,
      ClientesModule,
      
      MascotasModule,
      MascotasListaComponent
    
  ],
   
  templateUrl: './registro-cliente-mascota-component.component.html',
  styleUrl: './registro-cliente-mascota-component.component.css'
})
export class RegistroClienteMascotaComponentComponent {
  mostrarFormulario?: boolean;
  mostrarFormularioMascota?:boolean;
  
  constructor(private clienteService: SharedDataService) {
    this.clienteService.mostrarFormularioObservable.subscribe(mostrar => this.mostrarFormulario = mostrar);
    this.clienteService.mostrarFormularioMascotaObservable.subscribe(mostrar => this.mostrarFormularioMascota = mostrar);
}

ngOnInit(): void {

}
  
}
