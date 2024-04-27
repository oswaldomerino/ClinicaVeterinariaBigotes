import { Component } from '@angular/core';
import { formatDate } from 'date-fns';
import { ModalService } from '../../servicios/modal.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../../servicios/shared-data.service';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { SelecionarAplicacionModalComponent } from '../../shared/modal/selecionar-aplicacion-modal/selecionar-aplicacion-modal.component';
import { CommonModule } from '@angular/common';
import { RecepcionModule } from '../../recepcion/recepcion.module';
import { DescripcionActividadModalComponent } from '../../shared/modal/descripcion-actividad-modal/descripcion-actividad-modal.component';
import { AplicaTratamientoModalComponent } from '../../shared/modal/aplica-tratamiento-modal/aplica-tratamiento-modal.component';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [RecepcionModule,NgbModule, CommonModule],
  templateUrl: './consultas.component.html',
  styleUrl: './consultas.component.css'
})
export class ConsultasComponent {

  listaEspera: any[] = []
  modalAbierto=false
  // Declara una variable para almacenar la suscripción
  private modalSubscription!: Subscription;
  subscription: Subscription = new Subscription;

  constructor(private SharedDataService: SharedDataService,
    private modalService: NgbModal, private toasterService: ToastrService, private toastr: ToastrService,
    private _listEspetaFB: SalaEsperaService, private modalServiceCental: ModalService
  ) {

  }

  ngOnInit(): void {


    this.cargarLista();

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarLista(): void {
    this._listEspetaFB.getAllListasConEstatus('en espera').subscribe((lista:any) => {
      // Filtrar la lista para mostrar solo los elementos con estado "en espera" y infoServicio igual a "aplicacion" o "consulta"
      this.listaEspera = lista.filter((item:any) => item.status === 'en espera' && (item.infoServicio.categoria === 'aplicacion' || item.infoServicio.categoria === 'consultas'));

      // Ordenar la lista de espera por horaRecepcion de forma descendente (del más antiguo al más reciente)
      this.listaEspera.sort((a, b) => {
        const horaRecepcionA = new Date(a.horaRecepcion).getTime();
        const horaRecepcionB = new Date(b.horaRecepcion).getTime();
        return horaRecepcionA - horaRecepcionB;
      });

      // Formatear la fecha en un formato legible y agregar unidades al peso y precio
      this.listaEspera.forEach(item => {
        item.horaRecepcion = formatDate(item.horaRecepcion, 'HH:mm'); // Ejemplo de formato: 20/03/2024 14:30
        item.peso += ' kg'; // Agregar unidades al peso
        item.precio = '$' + item.precio // Agregar unidades al precio (asumiendo que es en pesos colombianos)
        console.log(item.id,item)
      });
    });
  }

  atenderMascota(registro: any) {
   
    if (registro.infoServicio.categoria == 'aplicacion') {
     
        
        this.SharedDataService.actualizarMascotaSeleccionada(registro.mascota);
        this.SharedDataService.actualizarClienteSeleccionado(registro.cliente);
        this.SharedDataService.servicioAplicacionSeleccionada(registro)
        // Lógica para agregar un nuevo cliente a la lista de espera
      

        
        // Luego puedes usarlo así:
      this.openModal(SelecionarAplicacionModalComponent,'xl').then(() => {
        // Aquí puedes abrir el siguiente modal si es necesario
        //this.openModal(PlanSaludComponent, 'xl');
      }).catch((error) => {
        console.error('Error al abrir el modal:', error);
      });
    }


  }

  openModal(viewModal:any,size:string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.modalAbierto) {
        console.log('El modal ya está abierto.');
        reject('El modal ya está abierto.');
      } else {
        this.modalAbierto = true;
        this.modalServiceCental.openModal(viewModal, size).subscribe(
          (result) => {
            console.log('Resultado del modal:', result);
            if (result) {
              switch(result.modal) {
                case 'select':
                  if(result.valor){
                    this.modalAbierto = false;
                    console.log('El modal se ha cerrado.');
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


  calcularEdad(fechaNacimiento: any) {
    let fechaNacimientoDate = new Date(fechaNacimiento);
    let hoy = new Date();
    let diff = hoy.getTime() - fechaNacimientoDate.getTime();
    let edad = new Date(diff);
  
    let años = edad.getFullYear() - 1970;
    let meses = edad.getMonth();
    let días = edad.getDate();
  
    let edadMascota = '';
    if (años > 0) {
      edadMascota += `${años} años`;
    }
    if (meses > 0) {
      edadMascota += `${edadMascota ? ', ' : ''}${meses} meses`;
    }
    if (días > 0) {
      edadMascota += `${edadMascota ? ' y ' : ''}${días} días`;
    }
    return edadMascota.toString();
   // this.edadMascota = edadMascota || 'Recién nacido';
  }
  

  finalizarServicio(item:any){
    const modalRef = this.modalService.open(AplicaTratamientoModalComponent, { size: 'lg' });
    modalRef.componentInstance.listaEspera = item; // Pasar la mascota al modal
  }

  agregarTemperamento(item:any){

  }

  agregarObservacion(item:any){
    const modalRef = this.modalService.open(DescripcionActividadModalComponent);
    modalRef.componentInstance.listaEspera = item; // Pasar la mascota al modal
  }

}
