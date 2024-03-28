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
      // Filtrar la lista para mostrar solo los elementos con estado "en espera" y categoría "estetica y baños"
      if(lista){
        this.listaEspeta = lista.filter(item => item.status === 'en espera' && item.infoServicio.categoria === 'estetica'  ||  item.infoServicio.categoria === 'baños'  );
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

  agregarObservacion(serv:any){

  }

  agregarTemperamento(erv:any){

  }
  
  finalizarServicio(erv:any){

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
