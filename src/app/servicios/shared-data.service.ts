import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private clienteId = new BehaviorSubject<string | null>(null);
  private clienteSeleccionado = new BehaviorSubject<any>(null);
  private mostrarFormulario = new BehaviorSubject<boolean>(true);
  private editarModo = new BehaviorSubject<boolean>(false);

    // Cliente
    private cliente = new BehaviorSubject<any>(null);
    clienteActual = this.cliente.asObservable();
    clienteIdObservable = this.clienteId.asObservable();
    clienteSeleccionadoObservable = this.clienteSeleccionado.asObservable();
    mostrarFormularioObservable = this.mostrarFormulario.asObservable();
    editarModoObservable = this.editarModo.asObservable();
  

    private mostrarFormularioMascota = new BehaviorSubject<boolean>(false);
    private editarModoMascota = new BehaviorSubject<boolean>(false);
    private mascotaSeleccionado = new BehaviorSubject<any>(null);
  
  
    // Mascota
    private mascota = new BehaviorSubject<any>(null);
    clienteMascota = this.mascota.asObservable();
    mostrarFormularioMascotaObservable = this.mostrarFormularioMascota.asObservable();
    editarModoMascotaObservable = this.editarModoMascota.asObservable();
    mascotaSeleccionadoObservable = this.mascotaSeleccionado.asObservable();
  
//servicios 
    private servicioSeleccionado = new BehaviorSubject<any>(null);
    servicioSeleccionadoObservable = this.servicioSeleccionado.asObservable();

        // Métodos relacionados con la mascota
        servicioAplicacionSeleccionada(servicio: any) {
          this.servicioSeleccionado.next(servicio);
        }

        getServicioAplicacionActual() {
          return this.servicioSeleccionado.getValue();
        }


    constructor() {}
  
    // Métodos relacionados con el cliente
    cambiarModoEdicion(editando: boolean): void {
      this.editarModo.next(editando);
    }
  
    actualizarClienteId(id: string) {
      this.clienteId.next(id);
    }
  
    editarCliente(cliente: any) {
      this.actualizarCliente(cliente);
      this.cambiarVistaFormulario(true);
    }
  
    cambiarVistaFormulario(mostrar: boolean) {
      this.mostrarFormulario.next(mostrar);
    }
  
    actualizarCliente(cliente: any) {
      this.cliente.next(cliente);
    }
  
    getClienteActual() {
      return this.cliente.getValue();
    }
  
    resetCliente() {
      this.cliente.next(null);
    }
  
    actualizarClienteSeleccionado(cliente: any) {
      this.clienteSeleccionado.next(cliente);
    }
  
    // Métodos relacionados con la mascota
    actualizarMascotaSeleccionada(mascota: any) {
      this.mascotaSeleccionado.next(mascota);
    }
  
    cambiarModoEdicionMascota(editando: boolean) {
      this.editarModoMascota.next(editando);
    }
  
    cambiarVistaFormularioMascota(mostrar: boolean) {
      this.mostrarFormularioMascota.next(mostrar);
    }
  
    actualizarMascota(mascota: any) {
      this.mascota.next(mascota);
    }
  
    getMascotaActual() {
      return this.mascota.getValue();
    }
  
    resetMascota() {
      this.mascota.next(null);
    }


    private showButtons = new BehaviorSubject<boolean>(true);
    showButtonsObservable = this.showButtons.asObservable();
  
    toggleButtons(show:boolean): void {
      this.showButtons.next(show);
    }


    private atendidoSource = new BehaviorSubject(null);
    atendidoActual = this.atendidoSource.asObservable();

    cambiarAtendido(atendido: any) {
      this.atendidoSource.next(atendido);
    }

    

    
  }