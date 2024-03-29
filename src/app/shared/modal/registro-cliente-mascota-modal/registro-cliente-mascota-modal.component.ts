import { Component } from '@angular/core';
import { SharedDataService } from '../../../servicios/shared-data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RegistroClienteMascotaComponentComponent } from '../../../clientes/registro-cliente-mascota-component/registro-cliente-mascota-component.component';
import { CommonModule } from '@angular/common';
import { ClientesListaComponent } from '../../../clientes/clientes-lista/clientes-lista.component';
import { ClientesModule } from '../../../clientes/clientes.module';
import { MascotasListaComponent } from '../../../mascotas/mascotas-lista/mascotas-lista.component';
import { MascotaFormularioComponent } from '../../../mascotas/mascota-formulario/mascota-formulario.component';
import { ClienteDetalleComponent } from '../../../clientes/cliente-detalle/cliente-detalle.component';
import { MascotaDetalleComponent } from '../../../mascotas/mascota-detalle/mascota-detalle.component';
import { MascotasModule } from '../../../mascotas/mascotas.module';
import { ToastrService } from 'ngx-toastr';
import { FirebaseModule } from '../../../firebase/firebase.module';

@Component({
  selector: 'app-registro-cliente-mascota-modal',
  standalone: true,
  imports: [CommonModule ,
RegistroClienteMascotaComponentComponent
       ],
       providers:[ToastrService,FirebaseModule,   { provide: NgbActiveModal, useValue: {} }],
  templateUrl: './registro-cliente-mascota-modal.component.html',
  styleUrl: './registro-cliente-mascota-modal.component.css'
})
export class RegistroClienteMascotaModalComponent {
  subscription: Subscription = new Subscription;
  

  
  
  mostrarFormulario?: boolean;
  mostrarFormularioMascota?:boolean;
  
  constructor(
    private clienteService: SharedDataService,
    public activeModal: NgbActiveModal
    ) {
    this.clienteService.mostrarFormularioObservable.subscribe(mostrar => this.mostrarFormulario = mostrar);
    this.clienteService.mostrarFormularioMascotaObservable.subscribe(mostrar => this.mostrarFormularioMascota = mostrar);
}

    ngOnInit(): void {
   
 
      
    }

    closeModal() {
      this.activeModal.close(); // Cierra el modal
    }

    ngOnDestroy(): void {
      // Asegúrate de cancelar la suscripción cuando el componente se destruya
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }


  
 
  


  }
