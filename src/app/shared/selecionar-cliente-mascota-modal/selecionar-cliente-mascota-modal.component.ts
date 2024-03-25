import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../servicios/shared-data.service';
import { ClientesListaComponent } from '../../clientes/clientes-lista/clientes-lista.component';
import { MascotaDetalleComponent } from '../../mascotas/mascota-detalle/mascota-detalle.component';
import { MascotasListaComponent } from '../../mascotas/mascotas-lista/mascotas-lista.component';
import { ModalService } from '../../servicios/modal.service';
import { FirestoreModule } from '@angular/fire/firestore';
import { ClientesModule } from '../../clientes/clientes.module';

@Component({
  selector: 'app-selecionar-cliente-mascota-modal',
  standalone: true,
  imports: [ClientesModule,ClientesListaComponent,MascotaDetalleComponent,MascotasListaComponent],
  providers:[ToastrService,ModalService,],
  templateUrl: './selecionar-cliente-mascota-modal.component.html',
  styleUrl: './selecionar-cliente-mascota-modal.component.css'
})
export class SelecionarClienteMascotaModalComponent {
  cliente: any = {};
  mascotaSeleccionada = false;
  clienteSeleccionado = false;
  private subscriptions: Subscription[] = [];

  constructor(
    public activeModal: NgbActiveModal,
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
      this.activeModal.close(result);
   
    }
  }

  closeModal(): void {
    this.activeModal.close();
  }
}