import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { SharedDataService } from '../../servicios/shared-data.service';
import { ModalService } from '../../servicios/modal.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClienteFormularioComponent } from '../../clientes/cliente-formulario/cliente-formulario.component';
import { FirebaseModule } from '../../firebase/firebase.module';
import { RegistroClienteMascotaComponentComponent } from '../../clientes/registro-cliente-mascota-component/registro-cliente-mascota-component.component';
import { ClienteService } from '../../servicios/cliente.service';
import { ClientesModule } from '../../clientes/clientes.module';
import { RegistroClienteMascotaModalComponent } from '../modal/registro-cliente-mascota-modal/registro-cliente-mascota-modal.component';
import { ClientesListaComponent } from '../../clientes/clientes-lista/clientes-lista.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MascotasModule } from '../../mascotas/mascotas.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule,MascotasModule],
  providers:[ToastrService,ModalService,],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  currentRoute: string = '';
  cliente: any = {};
  mascotaSeleccionada = false;
  clienteSeleccionado = false;

  @Output() toggleSidebar: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private router: Router,
    private clienteS: SharedDataService,
    private mascotaS: SharedDataService,
   private modalService: NgbModal,
   private toastr: ToastrService
  
  ) { }


  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
        console.log(this.currentRoute);
      }
    });

    this.clienteS.clienteActual.subscribe(cliente => {
      if (cliente) {
        this.cliente = cliente;
        this.clienteSeleccionado = true;
      }
    }, error => {
      this.toastr.error('Error al obtener los datos del cliente.', 'Error');
    }),
    this.clienteS.mascotaSeleccionadoObservable.subscribe(mascota => {
      if (mascota) {
        this.mascotaSeleccionada = true;
      }
    }, error => {
      this.toastr.error('Error al obtener los datos de la mascota.', 'Error');
    })
  
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }


  editarCliente(): void {
    // Aquí puedes abrir un modal o navegar a una página para editar un cliente
    // Necesitarás el ID del cliente para editar el cliente correcto
    // Por ejemplo, puedes navegar a la página de edición de clientes así:
    // ... código para manejar la selección del cliente ...

    // Cambiar la vista al listado de mascotas
    this.clienteS.resetCliente();
    this.clienteS.resetMascota();
    this.clienteS.cambiarVistaFormularioMascota(false);



    this.clienteS.actualizarClienteId(this.cliente.id);
    this.clienteS.cambiarModoEdicion(false);
    this.clienteS.editarCliente(this.cliente);


    this.openModal();
  }

  crearNuevoCliente(): void {
    // Aquí puedes abrir un modal o navegar a una página para crear un nuevo cliente
    // Por ejemplo, puedes navegar a la página de creación de clientes así:
    this.clienteS.resetCliente();
    this.clienteS.resetMascota();
    this.clienteS.actualizarClienteId('');
    const clienteNuevo: any = null;
    this.clienteS.cambiarModoEdicion(false);
    this.clienteS.editarCliente(clienteNuevo);
    this.clienteS.actualizarMascotaSeleccionada(null);
    this.clienteSeleccionado = false;
      this.openModal();
    
  }

  openModal(): void {
    const modalRef = this.modalService.open(RegistroClienteMascotaModalComponent, {
      size: 'xl', // ajusta el ancho según tus necesidades
      centered: true // Centra el contenido del modal
    });

    modalRef.result.then((result) => {
    

      // Aquí puedes manejar el resultado del modal, por ejemplo, si se agrega un nuevo cliente
    }).catch((reason) => {
      this.clienteSeleccionado = false;
      // Aquí puedes manejar el cierre del modal sin resultados
    });
  }
}
