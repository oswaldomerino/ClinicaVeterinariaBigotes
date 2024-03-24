import { Component } from '@angular/core';
import { SharedDataService } from '../../servicios/shared-data.service';
import { ClienteService } from '../../servicios/cliente.service';
import { Subscription, map } from 'rxjs';
import { Cliente } from '../../shared/interfaces/cliente.interface';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClienteFormularioComponent } from '../cliente-formulario/cliente-formulario.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes-lista',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule],

  templateUrl: './clientes-lista.component.html',
  styleUrl: './clientes-lista.component.css'
})
export class ClientesListaComponent {
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  filtros: any = {};
  filtroActivo = false;
  clienteSelecionado!: Cliente; // Definir la propiedad clienteSeleccionado
  showButtons = true;
  subscription: Subscription = new Subscription();

  constructor(
    private clienteService: ClienteService,
    private modalService: NgbModal,
    private toastService: ToastrService, // Inyectar el servicio de toasts
    private sharedDataService: SharedDataService,
    private router: Router,
    private clienteS: SharedDataService,

  ) {
    this.clienteS.showButtonsObservable.subscribe(show => {
      this.showButtons = show;
    });
  }

  ngOnInit(): void {
    this.obtenerClientes();



  }


  obtenerClientes(): void {
    this.clienteService.getAll().pipe(
      map(clientes => this.ordenarClientesPorFecha(clientes))
    ).subscribe(clientesOrdenados => {
      this.clientes = this.clientesFiltrados = clientesOrdenados;
      this.resetFiltros();
    });
  }

  ordenarClientesPorFecha(clientes: any): any[] {
    return clientes.sort((a: any, b: any) =>
      new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    );
  }

  aplicarFiltro(): void {
    this.clientesFiltrados = this.clientes.filter(cliente =>
      Object.keys(this.filtros).every(key => {
        if (!this.filtros[key]) return true;
        this.filtroActivo = true; // Establece filtroActivo como true si se aplica algún filtro
        // Verificar si alguna de las propiedades del cliente contiene el filtro
        if (key === 'nombre') {
          return cliente.nombres && cliente.nombres.some((nombres: string) => nombres.toLowerCase().includes(this.filtros[key].toLowerCase()));
        } else if (key === 'direccion') {
          return cliente.direcciones && cliente.direcciones.some((direccion: string) => direccion.toLowerCase().includes(this.filtros[key].toLowerCase()));
        } else if (key === 'telefono') {
          // Eliminar espacios en blanco del filtro de teléfono
          const filtroTelefono = this.filtros[key].replace(/\s+/g, '');
          return cliente.telefonos && cliente.telefonos.some((telefono: string) => telefono.replace(/\s+/g, '').toLowerCase().includes(filtroTelefono.toLowerCase()));
        } else {
          // Si no es ninguna de las propiedades específicas, buscar en todas
          return cliente[key] && cliente[key].toString().toLowerCase().includes(this.filtros[key].toLowerCase());
        }
      })
    );

    // Si todos los filtros están vacíos, limpiar la búsqueda y mostrar todos los clientes
    if (Object.values(this.filtros).every(value => !value)) {
      this.clientesFiltrados = this.clientes;
      this.filtroActivo = false;
    }
  }

  resetFiltros(): void {
    this.filtros = {};
    this.aplicarFiltro();
  }

  nuevoCliente(): void {
    const clienteNuevo: any = null;
    this.clienteS.cambiarModoEdicion(false);
    this.clienteS.editarCliente(clienteNuevo);
    this.openModal();
  }

  openModal(): void {
    const modalRef = this.modalService.open(ClienteFormularioComponent, {
      size: 'xl', // ajusta el ancho según tus necesidades
      centered: true // Centra el contenido del modal
    });

    modalRef.result.then((result) => {


      // Aquí puedes manejar el resultado del modal, por ejemplo, si se agrega un nuevo cliente
    }).catch((reason) => {
      // Aquí puedes manejar el cierre del modal sin resultados
    });
  }

  eliminarCliente(id: string): void {
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
        // Lógica para eliminar el cliente con el id especificado
        this.clienteService.eliminarCliente(id)
          .then(() => {
            this.toastService.success('El cliente ha sido eliminado correctamente.', '¡Eliminado!',);

            // Puedes agregar aquí más lógica después de eliminar el cliente
          })
          .catch(error => {
            console.error('Error al eliminar cliente:', error);
            this.toastService.error('¡Error!', 'Hubo un error al eliminar el cliente. Por favor, inténtalo de nuevo más tarde.');
          });
      }
    });
  }

  seleccionarCliente(cliente: any, event: MouseEvent): void {
    this.clienteS.actualizarClienteId(cliente.id);
    this.clienteSelecionado = cliente;
    this.clienteS.editarCliente(cliente);

    // Verificar si se hizo clic en un botón de acción
    const targetButton = event.target as HTMLElement;
    if (targetButton instanceof HTMLButtonElement) {
      if (targetButton.classList.contains('btn-danger')) {
        // Si se hizo clic en el botón "Eliminar", llamar a la función para eliminar el cliente
        this.eliminarCliente(cliente.id);
      } else if (targetButton.classList.contains('btn-primary')) {
        // Si se hizo clic en el botón "Editar", llamar a la función para editar el cliente
        this.editarCliente(cliente);
      }
    }
  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  editarCliente(cliente: any): void {

    // ... código para manejar la selección del cliente ...

    // Cambiar la vista al listado de mascotas
    this.clienteS.resetCliente();
    this.clienteS.resetMascota();
    this.clienteS.cambiarVistaFormularioMascota(false);



    this.clienteS.actualizarClienteId(cliente.id);
    this.clienteS.cambiarModoEdicion(true);
    this.clienteS.editarCliente(cliente);


    this.openModal();
  }

}