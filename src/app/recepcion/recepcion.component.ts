import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RecepcionModule } from './recepcion.module';
import { ListaEsperaComponent } from './lista-espera/lista-espera.component';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ModalService } from '../servicios/modal.service';
import { SalaEsperaService } from '../servicios/sala-espera.service';
import { SharedDataService } from '../servicios/shared-data.service';import { SelecionarClienteMascotaModalComponent } from '../shared/modal/selecionar-cliente-mascota-modal/selecionar-cliente-mascota-modal.component';
import { SelecionarServicioModalComponent } from '../shared/modal/selecionar-servicio-modal/selecionar-servicio-modal.component';
import { SelecionarAplicacionModalComponent } from '../shared/modal/selecionar-aplicacion-modal/selecionar-aplicacion-modal.component';
import { ServiciosAtendidosComponent } from './servicios-atendidos/servicios-atendidos.component';
import { Router } from '@angular/router';



@Component({
  selector: 'app-recepcion',
  standalone: true,
  imports: [RecepcionModule,CommonModule,ReactiveFormsModule,FormsModule,NgbModule,ListaEsperaComponent, ServiciosAtendidosComponent],
  templateUrl: './recepcion.component.html',
  styleUrl: './recepcion.component.css'
})
export class RecepcionComponent {

  atendidoSelecionado: any;
  listaEspeta:any[]=[]
  modalAbierto = false;
  // Declara una variable para almacenar la suscripción
  private modalSubscription!: Subscription;
  
  constructor(private sharedDataService: SharedDataService,
    private modalService: NgbModal, private toastr: ToastrService,
    private _listEspetaFB: SalaEsperaService,private modalServiceCental: ModalService,private router: Router
    ){
  
  }
  
  ngOnInit(): void {
  
    this.sharedDataService.toggleButtons(false);
    this.cargarLista();
    this.sharedDataService.atendidoActual.subscribe(atendido => this.atendidoSelecionado = atendido);
  
  
  }
  
  
  ngOnDestroy(): void {
    // Cancelar la suscripción al observable para evitar pérdidas de memoria
    this.sharedDataService.toggleButtons(true);
  }
  
  
  
  cargarLista(): void {
    this._listEspetaFB.getListaEspera().subscribe(lista => {
      // Filtrar la lista para mostrar solo los elementos con estado "en espera"
      this.listaEspeta = lista;

    });
  }
  
  
  
  openModal(viewModal:any,size:string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.modalAbierto) {
      
        reject('El modal ya está abierto.');
      } else {
        this.modalAbierto = true;
        this.modalServiceCental.openModal(viewModal, size).subscribe(
          (result) => {
            
            if (result) {
              switch(result.modal) {
                case 'select':
                  if(result.valor){
                    this.modalAbierto = false;
                  
                    resolve();
                  }
                  break;
                default:
                  break;
              }
            }
            this.modalAbierto = false;
          },
          (error) => {
            console.error('Error al abrir el modal:', error);
            reject(error);
          },
          () => {
            this.modalAbierto = false;
            console.log('El modal se ha cerrado.');
            resolve();
          }
        );
      }
    });
  }
  
  
  
  

  
  
  
  
  // Función para agregar un nuevo cliente
  SelecionarClienteMascota() {
    this.sharedDataService.actualizarMascotaSeleccionada(null);
    this.sharedDataService.actualizarCliente(null);
    // Lógica para agregar un nuevo cliente a la lista de espera
  
    // Luego puedes usarlo así:
  this.openModal(SelecionarClienteMascotaModalComponent,'xl').then(() => {
    // Aquí puedes abrir el siguiente modal si es necesario
    this.openModal(SelecionarServicioModalComponent, 'xl');
  }).catch((error) => {
    console.error('Error al abrir el modal:', error);
  });
  
  // this.openModal(SelecionarClienteMascotaSalaEsperaComponent,'xl')
  }
  
  // Función para agregar una visita
  agregarVisita() {
    this.sharedDataService.actualizarMascotaSeleccionada(null);
    this.sharedDataService.actualizarCliente(null);
    // Lógica para agregar un nuevo cliente a la lista de espera
  
    // Luego puedes usarlo así:
  this.openModal(SelecionarClienteMascotaModalComponent,'xl').then(() => {
    // Aquí puedes abrir el siguiente modal si es necesario
    this.openModal(SelecionarAplicacionModalComponent, 'xl');
  }).catch((error) => {
    console.error('Error al abrir el modal:', error);
  });
  
  // this.openModal(SelecionarClienteMascotaSalaEsperaComponent,'xl')
  
  }
  
  // Función para añadir peso
  agregarPeso() {
   // this.openModal(RegistrarPesoModalComponent,'')
    // Lógica para añadir peso a una mascota en espera
    console.log('Añadiendo peso...');
  }
  
  // Función para parar el plan
  pararPlan() {
    // Lógica para detener el plan de un cliente
    console.log('Parando plan...');
  }
  
  // Función para cobrar
  cobrar() {
    if (this.atendidoSelecionado) {
// Obtén el ID del cliente del servicio seleccionado
const clienteId = this.atendidoSelecionado.cliente.id;

// Busca en la lista de espera si hay algún servicio del mismo cliente que no haya sido pagado
const servicioNoPagado = this.listaEspeta.find(servicio => servicio.cliente.id === clienteId && !servicio.pagado);

if (servicioNoPagado) {
  // Si hay un servicio no pagado, redirige al usuario a la página de "venta-mostrador"
  this.router.navigate(['/venta-mostrador']);
} else {
  // Si todos los servicios han sido pagados, redirige al usuario a la página de "entregar mascota"
 // this.router.navigate(['/entregar-mascota']);
}

    } else {
      this.toastr.error('Necesita seleccionar un cliente en la lista');
    }
  }
  // Función para venta
  venta() {
    if (this.atendidoSelecionado) {
      this.router.navigate(['/venta-mostrador']);
    } else {
      this.toastr.error('Necesita seleccionar un cliente en la lista');
    }
  }
  
  // Función para editar
  editar() {
    // Lógica para editar una consulta
    console.log('Editando...');
  }
  
  // Función para consultar
  consultar() {
    // Lógica para consultar una consulta
    console.log('Consultando...');
  }
  
// Función para dar salida
darSalida() {
  if (this.atendidoSelecionado) {
    // Obtén el ID del cliente y de la mascota del servicio seleccionado
    const clienteId = this.atendidoSelecionado.cliente.id;
    const mascotaId = this.atendidoSelecionado.mascota.id;
    
// Busca en la lista de espera si hay algún servicio de la misma mascota que no haya sido pagado o no haya terminado
const serviciosMascotaPendientes = this.listaEspeta.filter(servicio => 
  servicio.mascota.id === mascotaId && servicio.cliente.id === clienteId && (!servicio.pagado || servicio.status !== 'atendido'));
    if (serviciosMascotaPendientes.length > 0) {
      // Si hay servicios de la mascota pendientes, muestra un error y redirige al usuario si es necesario
      const servicioNoPagado = serviciosMascotaPendientes.find(servicio => !servicio.pagado);
      if (servicioNoPagado) {
        this.router.navigate(['/venta-mostrador']);
        this.toastr.error('Hay servicios de la mascota que aún no han sido pagados.');
      } else {
        this.toastr.error('Hay servicios de la mascota que aún no han terminado.');
      }
      console.log(serviciosMascotaPendientes);
    } else {
      // Si todos los servicios de la mascota han sido pagados y terminados, da salida a todos los servicios de la mascota
      this.darSalidaMascota(this.atendidoSelecionado);
    }
  } else {
    this.toastr.error('Necesita seleccionar un cliente en la lista');
  }
}

// Función para dar salida a la mascota
darSalidaMascota(serv:any) {
  // Aquí va tu lógica para dar salida a la mascota
  const horaActual = new Date();

  // Actualiza todos los servicios de la mascota a 'entregado'
  this.listaEspeta.filter(servicio => servicio.mascota.id === serv.mascota.id && servicio.cliente.id === serv.cliente.id)
    .forEach(servicio => {
      this._listEspetaFB.updateListaEspera(servicio.id, { status: 'entregado' , horaEntregaMascota : horaActual.toISOString()}).subscribe(() => {
        // Cerrar el modal y pasar la mascota actualizada
        this.toastr.success(`La mascota ${serv.mascota.nombre} ha sido dada de alta.`);
      });
    });
}


  
  }
  