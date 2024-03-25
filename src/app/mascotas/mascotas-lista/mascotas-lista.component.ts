import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { MascotaService } from '../../servicios/mascota.service';
import { Subscription } from 'rxjs';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from '../../servicios/shared-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MascotasModule } from '../mascotas.module';

@Component({
  selector: 'app-mascotas-lista',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule,MascotasModule],
  templateUrl: './mascotas-lista.component.html',
  styleUrl: './mascotas-lista.component.css'
})
export class MascotasListaComponent {

  mascotas: any[] = [];
  idCliente: string | null = null;
  mascotaSeleccionada: any;
  temperamento: string[] = ['Amigable'];
  subscription: Subscription = new Subscription();
  showButtons:boolean=true;

  constructor(
    private mascotasService: MascotaService,
    private modalService: NgbModal,
    private sharedDataService: SharedDataService
  ) { 
    this.subscription = this.sharedDataService.clienteIdObservable.subscribe(id => {
      this.idCliente = id;
   
      if (this.idCliente) {
        this.obtenerMascotasPorCliente();
      }
    });

    this.sharedDataService.showButtonsObservable.subscribe(show => {
      this.showButtons = show;
    });
  }

  ngOnInit(): void {
    this.sharedDataService.clienteIdObservable.subscribe(cliente => this.idCliente = cliente);
  

  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  obtenerMascotasPorCliente(): void {
    if (this.idCliente) {
      this.mascotasService.getMascotasPorCliente(this.idCliente).then((mascotas: any[]) => {
        this.mascotas = mascotas;
              // Seleccionar la mascota en la posición 0 por defecto
      if (this.mascotas.length > 0) {
        this.mascotaSeleccionada = this.mascotas[0];
        this.sharedDataService.actualizarMascotaSeleccionada(this.mascotas[0]);
      }
        if (!this.mascotas.length) {
          //console.log('No hay mascotas disponibles para este cliente.');
        }
      }).catch(error => {
        console.error('Error al obtener mascotas:', error);
      });
    }
  }

  editarMascota(mascota: any): void {
    this.sharedDataService.actualizarMascotaSeleccionada(mascota);
    this.sharedDataService.cambiarVistaFormularioMascota(true);
  }

  eliminarMascota(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.mascotasService.eliminarMascota(id).then(() => {
          Swal.fire('¡Eliminado!', 'La mascota ha sido eliminada correctamente.', 'success');
          this.obtenerMascotasPorCliente();
        }).catch(error => {
          console.error('Error al eliminar mascota:', error);
          Swal.fire('¡Error!', 'Hubo un error al eliminar la mascota. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
      }
    });
  }

  selectMascota(mascota: any, event: MouseEvent): void {
    this.mascotaSeleccionada =mascota;
    this.sharedDataService.actualizarMascotaSeleccionada(mascota);
  }
  

  servicios(mascota:any){

  }
}
