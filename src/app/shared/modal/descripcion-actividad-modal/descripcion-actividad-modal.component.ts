import { Component } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SalaEsperaService } from '../../../servicios/sala-espera.service';

import {  FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-descripcion-actividad-modal',
  standalone: true,
  imports: [NgSelectModule,FormsModule, CommonModule],
  templateUrl: './descripcion-actividad-modal.component.html',
  styleUrl: './descripcion-actividad-modal.component.css'
})
export class DescripcionActividadModalComponent {
  
  listaEspera!:any
  loadingDescripciones = false; // Indicador de carga de descripciones
  descripciones: any[] = [];
  selectDescripciones: any[] = [];
  toastr: any;


  constructor(
    public activeModal: NgbActiveModal,
    private _listEspetaFB: SalaEsperaService,
    private descripcionService:GestionVeterinariaService,
  ) {
  }


  
  ngOnInit(): void {
    this.consultarDescripciones()
  }


  consultarDescripciones(): void {
    // Consultar las descripciones desde Firebase
    this.descripcionService.getAllDescripciones().subscribe(descripciones => {
        // Verificar si descripciones es un array
        if (Array.isArray(descripciones)) {
            // Mapear las descripciones obtenidas para asignarles un ID único
            this.descripciones = descripciones.map((descripcion: any, index: number) => ({ id: descripcion.nombre, name: descripcion.nombre }));
            console.log(this.descripciones);
            this.cargarDatosListaSeleccionada()
        } else {
            console.error('El valor de "descripciones" no es un array:', descripciones);
        }
    });
  }
  

  cargarDatosListaSeleccionada(): void {
    if (this.listaEspera && this.listaEspera.descripciones) {
      this.selectDescripciones = this.listaEspera.descripciones
      console.log(this.selectDescripciones);
    } else {
      console.error('Mascota o temperamentos de la mascota son undefined o null');
    }
}

  addTagDescripcionPromise = (name: string) => {
    return new Promise((resolveDescripcion) => {
      this.loadingDescripciones = true;
      // Simular una llamada a la base de datos para agregar la nueva descripción
      setTimeout(() => {
        // Crear el objeto de la descripción con el nombre proporcionado
        const descripcion = { nombre: name }; // Objeto con la estructura adecuada
        console.log('Descripción a agregar:', descripcion); // Verificar la descripción que se va a agregar
        // Agregar la nueva descripción a Firebase utilizando el servicio
        console.log('Antes de agregar la descripción a Firebase');
        this.descripcionService.addDescripcion(descripcion)
          .then((doc) => {
           // this.listaEsperaForm.controls['descripciones'].setValue(descripcion);
            console.log('Descripción agregada a Firebase:', doc); // Verificar la respuesta de Firebase
            this.toastr.success('Descripción agregada!', 'La descripción se ha agregado correctamente.');
            // Resuelve la promesa con un objeto que contiene el ID de la nueva descripción y su nombre
            resolveDescripcion({ id: name, name: name, valid: true });
            this.loadingDescripciones = false;
          })
          .catch(error => {
            console.error('Error al agregar descripción a la base de datos:', error);
            this.toastr.error('¡Error!', 'Hubo un error al agregar la descripción. Por favor, inténtalo de nuevo más tarde.');
          });
      }, 1000);
    });
  };


  
  closeModal() {
    this.activeModal.close(); // Cierra el modal
  }

  agregarDescripcion(){
    this._listEspetaFB.updateListaEspera(this.listaEspera.id, { descripciones: this.selectDescripciones }).subscribe(() => {
      // Cerrar el modal y pasar la mascota actualizada
      this.activeModal.close(this.listaEspera);
    });
  }

}
