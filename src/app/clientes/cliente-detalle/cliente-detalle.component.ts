import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs';
import { SharedDataService } from '../../servicios/shared-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface Vacuna {
  comentario: string;
  fechaAplicacion: string;
  idMedicamento: string;
  medicamento: string;
  periodicidad: number;
  pesoMascota: number;
  precioVacuna: number;
  proximaCita: string;
}

@Component({
  selector: 'app-cliente-detalle',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule],
  templateUrl: './cliente-detalle.component.html',
  styleUrl: './cliente-detalle.component.css'
})
export class ClienteDetalleComponent {
  editarModo: boolean = false;
  clienteAEditar: any;
  cliente!: any; // Recibe el cliente seleccionado
  subscription: Subscription = new Subscription;
  constructor(private clienteService: SharedDataService) {}

  ngOnInit(): void {
    // Suscribirse al cliente actual
    this.clienteService.clienteActual.subscribe(cliente => this.cliente = cliente);
  }

  // Método para editar un cliente
  editarCliente(): void {
    // Actualizar el ID del cliente en el servicio
    this.clienteService.actualizarClienteId(this.cliente.id);
    // Cambiar a modo edición en el servicio
    this.clienteService.cambiarModoEdicion(true);
    // Editar el cliente en el servicio
    this.clienteService.editarCliente(this.cliente); 
  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Método para iniciar el registro de una mascota
  iniciarRegistroMascota(): void {
    
    // Mostrar el formulario de registro de mascotas
    this.clienteService.actualizarMascotaSeleccionada(null);
    this.clienteService.cambiarVistaFormularioMascota(true);
    // Navegar a la ruta de registro de mascotas
    // this.router.navigate(['/registro-mascota', this.clienteAEditar.id]);
  }
}
