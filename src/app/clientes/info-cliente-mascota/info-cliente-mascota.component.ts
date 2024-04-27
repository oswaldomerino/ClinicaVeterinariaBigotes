import { Component } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { MascotaDetalleComponent } from '../../mascotas/mascota-detalle/mascota-detalle.component';
import { MascotasListaComponent } from '../../mascotas/mascotas-lista/mascotas-lista.component';
import { ModalService } from '../../servicios/modal.service';
import { SharedDataService } from '../../servicios/shared-data.service';
import { ClientesListaComponent } from '../clientes-lista/clientes-lista.component';
import { ClientesModule } from '../clientes.module';

@Component({
  selector: 'app-info-cliente-mascota',
  standalone: true,
  imports: [ClientesModule,ClientesListaComponent,MascotaDetalleComponent,MascotasListaComponent],
  providers:[ToastrService,ModalService,],
  templateUrl: './info-cliente-mascota.component.html',
  styleUrl: './info-cliente-mascota.component.css'
})
export class InfoClienteMascotaComponent {
  cliente: any = {};
  mascotaSeleccionada = false;
  clienteSeleccionado = false;
  private subscriptions: Subscription[] = [];

  constructor(
  
    private mascotaService: SharedDataService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.mascotaService.clienteActual.subscribe(cliente => {
        if (cliente) {
          this.cliente = cliente;
          this.clienteSeleccionado = true;
        }
      }, error => {
        this.toastr.error('Error al obtener los datos del cliente.', 'Error');
      }),
      this.mascotaService.mascotaSeleccionadoObservable.subscribe(mascota => {
        if (mascota) {
          this.mascotaSeleccionada = true;
        }
      }, error => {
        this.toastr.error('Error al obtener los datos de la mascota.', 'Error');
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  clienteMascotaSelecionados(): void {
    if (!this.clienteSeleccionado || !this.mascotaSeleccionada) {
      this.toastr.error('Por favor, selecciona un cliente y una mascota antes de continuar.', 'Error');
    } else {
      this.toastr.success('Cliente y mascota seleccionados correctamente.', 'Éxito');
const result={modal:'select', valor:this.clienteSeleccionado}
     
   
    }
  }


}