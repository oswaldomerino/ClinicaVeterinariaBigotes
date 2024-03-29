import { Component } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { MascotaService } from '../../../servicios/mascota.service';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MascotasModule } from '../../../mascotas/mascotas.module';
import { ModalService } from '../../../servicios/modal.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FirebaseModule } from '../../../firebase/firebase.module';

@Component({
  selector: 'app-temperamento-modal',
  standalone: true,
  imports: [NgSelectModule,FormsModule,FirebaseModule,ToastrModule],
  providers:[ToastrService],
  templateUrl: './temperamento-modal.component.html',
  styleUrl: './temperamento-modal.component.css'
})
export class TemperamentoModalComponent {
  mascota: any; // Aquí se almacenará la mascota que pasaste desde el componente padre
  temperamentos: any[] = [];
  loadingTemperamento: boolean = false;
  selectedTemperamentos: string[] = [];


  
  constructor(
    public activeModal: NgbActiveModal,
    private mascotaService: MascotaService,
    private toastr: ToastrService // Inyecta ToastrService

  ) { }

  ngOnInit(): void {
    this.consultarTemperamentos();
    

    console.log(this.mascota)
    
  }


  cargarDatosMascotaSeleccionada(): void {
    if (this.mascota && this.mascota.temperamentos) {
      this.selectedTemperamentos = this.mascota.temperamentos
      console.log(this.selectedTemperamentos);
    } else {
      console.error('Mascota o temperamentos de la mascota son undefined o null');
    }
}

  


consultarTemperamentos(): void {
  this.mascotaService.getAllTemperamentos().subscribe((temperamentos: any[]) => {
    if (Array.isArray(temperamentos)) {
      this.temperamentos = temperamentos.map((temperamento: any) => ({ id: temperamento.nombre, name: temperamento.nombre }));

      // Ordenar temperamentos por longitud de nombre de menor a mayor
      this.temperamentos.sort((a, b) => a.name.length - b.name.length);

      console.log(this.temperamentos)
      this.cargarDatosMascotaSeleccionada()
    } else {
      console.error('El valor de "temperamentos" no es un array:', temperamentos);
    }
  });
}




addTagTemperamentoPromise = (name: string) => {
  return new Promise((resolveTemperamentos) => {
    this.loadingTemperamento = true;
    setTimeout(() => {
      const temperamento = { nombre: name };
      console.log('Temperamento a agregar:', temperamento);
      console.log('Antes de agregar el temperamento a Firebase');
      this.mascotaService.addTemperamento(temperamento)
        .then((doc: any) => {
          console.log('Temperamento agregado a Firebase:', doc);
          this.toastr.success('El temperamento se ha agregado correctamente.', 'Temperamento agregado!'); // Cambia Swal.fire() a toastr.success()
          resolveTemperamentos({ id: name, name: name, valid: true });
          this.loadingTemperamento = false;
        })
        .catch((error: any) => {
          console.error('Error al agregar temperamento a la base de datos:', error);
          this.toastr.error('Hubo un error al agregar el temperamento. Por favor, inténtalo de nuevo más tarde.', '¡Error!'); // Cambia Swal.fire() a toastr.error()
        });
    }, 1000);
  });
};


  closeModal() {
    this.activeModal.close(); // Cierra el modal
  }

  agregarTemperamento(){
    this.mascotaService.updateMascota(this.mascota.id, { temperamentos: this.selectedTemperamentos }).subscribe(() => {
      // Cerrar el modal y pasar la mascota actualizada
      this.activeModal.close(this.mascota);
      // Mostrar una alerta de éxito
      this.toastr.success('El temperamento se ha agregado correctamente a la mascota.', '¡Temperamento agregado!');
    });
  }
  
}
