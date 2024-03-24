import { Component } from '@angular/core';
import { SharedDataService } from '../../servicios/shared-data.service';
import { ClientesModule } from '../clientes.module';
import { ClienteFormularioComponent } from '../cliente-formulario/cliente-formulario.component';
import { MascotaFormularioComponent } from '../../mascotas/mascota-formulario/mascota-formulario.component';
import { CommonModule } from '@angular/common';
import { ClienteDetalleComponent } from '../cliente-detalle/cliente-detalle.component';
import { MascotasListaComponent } from '../../mascotas/mascotas-lista/mascotas-lista.component';

@Component({
  selector: 'app-registro-cliente-mascota-component',
  standalone: true,
    imports: [
      CommonModule,
      MascotaFormularioComponent,
      ClientesModule,
      ClienteDetalleComponent,
    MascotasListaComponent],
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
