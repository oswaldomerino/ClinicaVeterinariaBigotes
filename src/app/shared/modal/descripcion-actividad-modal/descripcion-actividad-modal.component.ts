import { Component } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SalaEsperaService } from '../../../servicios/sala-espera.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

// Definición de la interfaz para las descripciones
interface Descripcion {
  id: string;
  name: string;
}

@Component({
  selector: 'app-descripcion-actividad-modal',
  standalone: true,
  imports: [NgSelectModule,FormsModule, CommonModule],
  providers:[ToastrService],
  templateUrl: './descripcion-actividad-modal.component.html',
  styleUrl: './descripcion-actividad-modal.component.css'
})
export class DescripcionActividadModalComponent {
  
  listaEspera!:any // Variable para almacenar la lista de espera
  descripciones: Descripcion[] = []; // Array para almacenar las descripciones
  selectDescripciones: Descripcion[] = []; // Array para almacenar las descripciones seleccionadas
  loadingDescripciones: boolean = false; // Variable para controlar el indicador de carga
  // Método para seleccionar una descripción
  selectDescripcion(descripcion: Descripcion): void {
    if (!this.selectDescripciones.find(d => d.id === descripcion.id)) {
      this.selectDescripciones.push(descripcion);
    }
  }

  // Método para deseleccionar una descripción
  deselectDescripcion(descripcion: Descripcion): void {
    this.selectDescripciones = this.selectDescripciones.filter(d => d.id !== descripcion.id);
  }

  // Método para verificar si una descripción está seleccionada
  isDescripcionSelected(descripcion: Descripcion): boolean {
    return this.selectDescripciones.some(d => d.id === descripcion.id);
  }
  // Constructor con los servicios necesarios inyectados
  constructor(
    public activeModal: NgbActiveModal,
    private _listEspetaFB: SalaEsperaService,
    private descripcionService:GestionVeterinariaService,
    private toastr: ToastrService
  ) {}

  // Método que se ejecuta al iniciar el componente
  ngOnInit(): void {
    this.consultarDescripciones() // Llama al método para consultar las descripciones
  }

  // Método para consultar las descripciones
  consultarDescripciones(): void {
    this.descripcionService.getAllDescripciones().subscribe(
      descripciones => {
        if (Array.isArray(descripciones)) {
          this.descripciones = descripciones.map((descripcion: any) => ({ id: descripcion.nombre, name: descripcion.nombre }));
          this.cargarDatosListaSeleccionada(); // Llama al método para cargar los datos de la lista seleccionada
        }
      },
      error => {
        this.toastr.error('¡Error!', 'Hubo un error al cargar las descripciones. Por favor, inténtalo de nuevo más tarde.');
      }
    );
  }

  // Método para cargar los datos de la lista seleccionada
  cargarDatosListaSeleccionada(): void {
    if (this.listaEspera && this.listaEspera.descripciones) {
      this.selectDescripciones = this.listaEspera.descripciones;
    } else {
      this.toastr.error('¡Error!', 'Mascota o temperamentos de la mascota son undefined o null');
    }
  }

  // Método para agregar una descripción
  addTagDescripcionPromise = (name: string) => {
    return new Promise((resolveDescripcion) => {
      const descripcion = { nombre: name };
      this.descripcionService.addDescripcion(descripcion)
        .then(() => {
          resolveDescripcion({ id: name, name: name, valid: true });
        })
        .catch(error => {
          this.toastr.error('¡Error!', 'Hubo un error al agregar la descripción. Por favor, inténtalo de nuevo más tarde.');
        });
    });
  };

  // Método para cerrar el modal
  closeModal() {
    this.activeModal.close();
  }

  // Método para agregar una descripción
  agregarDescripcion(){
    this._listEspetaFB.updateListaEspera(this.listaEspera.id, { descripciones: this.selectDescripciones }).subscribe(() => {
      this.activeModal.close(this.listaEspera);
      this.toastr.success('La descripción se ha actualizado correctamente.', '¡Descripción actualizada!');
    });
  }
}