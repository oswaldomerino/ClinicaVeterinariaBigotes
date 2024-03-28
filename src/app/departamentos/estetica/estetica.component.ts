import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../../servicios/shared-data.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../../servicios/modal.service';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { format } from 'date-fns';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecepcionModule } from '../../recepcion/recepcion.module';
import { MascotaService } from '../../servicios/mascota.service';
import { TemperamentoModalComponent } from '../../shared/modal/temperamento-modal/temperamento-modal.component';
import { DescripcionActividadModalComponent } from '../../shared/modal/descripcion-actividad-modal/descripcion-actividad-modal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-estetica',
  standalone: true,
  imports: [RecepcionModule,CommonModule,ReactiveFormsModule,FormsModule,NgbModule],
  templateUrl: './estetica.component.html',
  styleUrl: './estetica.component.css'
})
export class EsteticaComponent {


  listaEspeta:any[]=[]
  modalAbierto = false;
  // Declara una variable para almacenar la suscripción
  private modalSubscription!: Subscription;
  subscription: Subscription = new Subscription;
  
  constructor(private sharedDataService: SharedDataService,
    private modalService: NgbModal, private toasterService: ToastrService,private toastr: ToastrService,
    private _listEspetaFB: SalaEsperaService,private modalServiceCental: ModalService,
    private mascotasService: MascotaService,
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
    this._listEspetaFB.getAllListasConEstatus('en espera').subscribe((lista:any) => {
      // Filtrar la lista para mostrar solo los elementos con estado "en espera" y categoría "estetica y baños"
      if(lista){
        this.listaEspeta = lista.filter((item:any) => item.status === 'en espera' && item.infoServicio.categoria === 'estetica'  ||  item.infoServicio.categoria === 'baños'  );
       // console.log(lista)



       
      }


      
      // Ordenar la lista de espera por horaRecepcion de forma descendente (del más antiguo al más reciente)
      this.listaEspeta.sort((a, b) => {
        const horaRecepcionA = new Date(a.horaRecepcion).getTime();
        const horaRecepcionB = new Date(b.horaRecepcion).getTime();
        return horaRecepcionA - horaRecepcionB;
      });
  
 // Consultar la información de cada mascota y agregar el temperamento a cada elemento de la lista
 this.listaEspeta = this.listaEspeta.map((item:any) => {
  this.mascotasService.getMascotaById(item.mascota.id).subscribe((mascota:any) => {
    item.mascota.temperamentos = mascota.temperamentos;
  });
  return item;
 })


     
    });
  

  }

  agregarObservacion(serv:any){
    const modalRef = this.modalService.open(DescripcionActividadModalComponent);
    modalRef.componentInstance.listaEspera = serv; // Pasar la mascota al modal
  }

  agregarTemperamento(erv:any){
   
    const modalRef = this.modalService.open(TemperamentoModalComponent);
    modalRef.componentInstance.mascota = erv.mascota; // Pasar la mascota al modal
    
  }
  
  finalizarServicio(servAtendido: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Estás a punto de finalizar el servicio para la mascota ${servAtendido.mascota.nombre}. Esta mascota tiene la categoría ${servAtendido.infoServicio.categoria} y los siguientes complementos: ${servAtendido.costosExtras.nombre}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, finalizar servicio',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí puedes agregar la lógica para editar el status de la lista en "atendido"
        // ...
  this.updateStatus(servAtendido)

      }
    });
  }

  updateStatus(servAtendido:any){
    this._listEspetaFB.updateListaEspera(servAtendido.id, { status: 'atendido' }).subscribe(() => {
      // Cerrar el modal y pasar la mascota actualizada
      Swal.fire(
        '¡Servicio finalizado!',
        'El servicio para la mascota ha sido finalizado exitosamente.',
        'success'
      );
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
}
