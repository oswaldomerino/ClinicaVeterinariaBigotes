import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SharedDataGestionVeterinariaService } from '../../../servicios/shared-data-gestion-veterinaria.service';
import { Servicio } from '../../../shared/interfaces/servicios-veterinarios.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-servicios-lista',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule],
  templateUrl: './servicios-lista.component.html',
  styleUrl: './servicios-lista.component.css'
})
export class ServiciosListaComponent {
  servicios: Servicio[] = []; // Asegúrate de tener una interfaz o clase Servicio
  filtro: string = '';
  subscription: Subscription = new Subscription;
  constructor(private _servicio :GestionVeterinariaService,
              private sharedDataService : SharedDataGestionVeterinariaService) { }

  ngOnInit(): void {
    this.cargarServicios();
  }

  cargarServicios(): void {
    this._servicio.getAll().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  editarServicio(service:Servicio): void {
    // Aquí puedes implementar la lógica para editar un servicio
    // Por ejemplo, podrías navegar a una página de edición con el id del servicio
    this.sharedDataService.setServicioSeleccionado(service);
  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  eliminarServicio(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._servicio.eliminarServicio(id).then(() => {
          // Elimina el servicio del array después de que se haya eliminado de la base de datos
          this.servicios = this.servicios.filter(servicio => servicio.id !== id);
          Swal.fire(
            '¡Eliminado!',
            'El servicio ha sido eliminado.',
            'success'
          );
        }, error => {
          Swal.fire(
            '¡Error!',
            'Hubo un error al eliminar el servicio.',
            'error'
          );
        });
      }
    });
  }


  filtrarServicios(): any[] {
    if (!this.filtro) {
      return this.servicios;
    }
    return this.servicios.filter(servicio =>
      servicio.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      
    );
  }
  


}
