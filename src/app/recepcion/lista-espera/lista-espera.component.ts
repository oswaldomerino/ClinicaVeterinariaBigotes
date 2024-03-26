import { Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { ModalService } from '../../servicios/modal.service';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { SharedDataService } from '../../servicios/shared-data.service';
import { RecepcionModule } from '../recepcion.module';


@Component({
  selector: 'app-lista-espera',
  standalone: true,
  imports: [RecepcionModule,CommonModule,ReactiveFormsModule,FormsModule,NgbModule],
  templateUrl: './lista-espera.component.html',
  styleUrl: './lista-espera.component.css'
})
export class ListaEsperaComponent {


  listaEspeta:any[]=[]
  modalAbierto = false;
  // Declara una variable para almacenar la suscripción
  private modalSubscription!: Subscription;
  subscription: Subscription = new Subscription;
  
  constructor(private sharedDataService: SharedDataService,
    private modalService: NgbModal, private toasterService: ToastrService,private toastr: ToastrService,
    private _listEspetaFB: SalaEsperaService,private modalServiceCental: ModalService
    ){
  
  }
  
  ngOnInit(): void {
  
    this.sharedDataService.toggleButtons(false);
    this.cargarLista();
  
  }
  
  
  ngOnDestroy(): void {
    // Cancelar la suscripción al observable para evitar pérdidas de memoria
    this.sharedDataService.toggleButtons(true);


      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    
  }
  
  
  
  cargarLista(): void {
    this._listEspetaFB.getAllListasConEstatus('en espera').subscribe(lista => {
      // Filtrar la lista para mostrar solo los elementos con estado "en espera"
      //console.log(lista)
      if(lista){
        this.listaEspeta = lista.filter(item => item.status === 'en espera');
        console.log(lista)
      }
      
  
      // Ordenar la lista de espera por horaRecepcion de forma descendente (del más antiguo al más reciente)
      this.listaEspeta.sort((a, b) => {
        const horaRecepcionA = new Date(a.horaRecepcion).getTime();
        const horaRecepcionB = new Date(b.horaRecepcion).getTime();
        return horaRecepcionA - horaRecepcionB;
      });
  
      // Formatear la fecha en un formato legible y agregar unidades al peso y precio
      this.listaEspeta.forEach(item => {
        item.horaRecepcion = format(new Date(item.horaRecepcion), 'dd/MM/yyyy HH:mm'); // Ejemplo de formato: 20/03/2024 14:30
        item.peso += ' kg'; // Agregar unidades al peso
        item.precio = '$' + item.precio // Agregar unidades al precio (asumiendo que es en pesos colombianos)
      });
    });
  }
  
  
  openModal(viewModal:any,size:string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.modalAbierto) {
        //console.log('El modal ya está abierto.');
        reject('El modal ya está abierto.');
      } else {
        this.modalAbierto = true;
        this.modalServiceCental.openModal(viewModal, size).subscribe(
          (result) => {
            //console.log('Resultado del modal:', result);
            if (result) {
              switch(result.modal) {
                case 'select':
                  if(result.valor){
                    this.modalAbierto = false;
                    //console.log('El modal se ha cerrado.');
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
            //console.log('El modal se ha cerrado.');
            resolve();
          }
        );
      }
    });
  }
  
  
  
  
  openModal1(viewModal:any,size:string): void {
    // Verificar si el modal ya está abierto
    if (this.modalAbierto) {
      //console.log('El modal ya está abierto.');
      return;
    }
  
  
  
    this.modalAbierto = true;
    this.modalServiceCental.openModal(viewModal, size).subscribe(
      (result) => {
        // Aquí recibes el resultado del modal y puedes realizar acciones según sea necesario
        //console.log('Resultado del modal:', result);
        if (result) {
          // Realizar acciones según el resultado del modal
          switch(result.modal) {
            case 'select':
              if(result.valor){
                this.modalAbierto = false; // Restablecer la bandera al cerrar el modal
               // //console.log('El modal se ha cerrado.');
                // Verificar si el modal ya está abierto antes de intentar abrirlo nuevamente
                if (!this.modalAbierto) {
                 // this.openModal(PlanificacionListaEsperaModalComponent,'');
                }
              }
              break;
            default:
              // Código para manejar otros casos
              break;
          }
        }
        this.modalAbierto = false; // Restablecer la bandera al cerrar el modal
      },
      (error) => {
        console.error('Error al abrir el modal:', error);
      },
      () => {
        // Esta función se ejecuta cuando el modal se cierra
        this.modalAbierto = false; // Restablecer la bandera al cerrar el modal
        //console.log('El modal se ha cerrado.');
      }
    );
  }
  
  
  
  
  // Función para agregar un nuevo cliente
  SelecionarClienteMascota() {
    this.sharedDataService.actualizarMascotaSeleccionada(null);
    this.sharedDataService.actualizarCliente(null);
    // Lógica para agregar un nuevo cliente a la lista de espera
  

    /*
    // Luego puedes usarlo así:
  this.openModal(SelecionarClienteMascotaSalaEsperaComponent,'xl').then(() => {
    // Aquí puedes abrir el siguiente modal si es necesario
    this.openModal(PlanificacionListaEsperaModalComponent, '');
  }).catch((error) => {
    console.error('Error al abrir el modal:', error);
  });
  */
  // this.openModal(SelecionarClienteMascotaSalaEsperaComponent,'xl')
  }
  
  // Función para agregar una visita
  agregarVisita() {
    // Lógica para agregar una visita a la lista de espera
    //console.log('Agregando visita...');
  }
  
  // Función para añadir peso
  agregarPeso() {
    //this.openModal(RegistrarPesoModalComponent,'')
    // Lógica para añadir peso a una mascota en espera
    //console.log('Añadiendo peso...');
  }
  
  // Función para parar el plan
  pararPlan() {
    // Lógica para detener el plan de un cliente
    //console.log('Parando plan...');
  }
  
  // Función para cobrar
  cobrar() {
    // Lógica para realizar el cobro de una consulta
    //console.log('Cobrando...');
  }
  
  // Función para venta
  venta() {
    // Lógica para realizar una venta
    //console.log('Venta...');
  }
  
  // Función para editar
  editar() {
    // Lógica para editar una consulta
    //console.log('Editando...');
  }
  
  // Función para consultar
  consultar() {
    // Lógica para consultar una consulta
    //console.log('Consultando...');
  }
  
  // Función para dar salida
  darSalida() {
    // Lógica para dar salida a una consulta
    //console.log('Dando salida...');
  }
  
  
}
