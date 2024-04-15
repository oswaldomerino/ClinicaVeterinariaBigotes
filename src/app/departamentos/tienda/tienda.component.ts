import { Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClienteService } from '../../servicios/cliente.service';
import { map } from 'rxjs';
import { MascotaService } from '../../servicios/mascota.service';
import { GestionVeterinariaService } from '../../servicios/gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirestoreModule } from '@angular/fire/firestore';


interface Producto {
  precio: number;
  // otras propiedades de producto...
}


@Component({
  selector: 'app-tienda',
  standalone: true,
  imports: [NgSelectModule,
        CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit{
  productos:any = []; // Aquí almacenarás los productos en el carrito
  total:number = 0;
  descuento = 0;
  iva = 0;
  subtotal = 0;
  totalPagar = 0;
  clientes: any[] = [];

  clientesFiltrados: any[] = [];
  clienteSeleccionado: any[] = [];
  mascotas: any[] = [];
  idCliente: string | null = null;
  empleados: any[] = [];

  constructor(
    private clienteService: ClienteService,
    private mascotasService: MascotaService,
    private empleadoService: GestionVeterinariaService,
  ) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerEmpleados();
    console.log('Clientes:', this.clientes);
  }



  
  obtenerClientes(): void {
    this.clienteService.getAll().pipe(
      map(clientes => this.ordenarClientesPorFecha(clientes))
    ).subscribe(clientesOrdenados => {
      this.clientes = this.clientesFiltrados = clientesOrdenados;
    //  this.resetFiltros();
    });
    
  }

  ordenarClientesPorFecha(clientes: any): any[] {
    return clientes.sort((a: any, b: any) =>
      new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    );
  }

  obtenerMascotasPorCliente(clienteSeleccionado:any): void {
    console.log('Cliente seleccionado:', clienteSeleccionado);
    this.mascotas= [];
    if (clienteSeleccionado.id) {
      this.mascotasService.getMascotasPorCliente(clienteSeleccionado.id).then((mascotas: any[]) => {
        this.mascotas = mascotas;
              // Seleccionar la mascota en la posición 0 por defecto
      if (this.mascotas.length > 0) {

      }
        if (!this.mascotas.length) {
          //console.log('No hay mascotas disponibles para este cliente.');
        }
      }).catch(error => {
        console.error('Error al obtener mascotas:', error);
      });
    }
  }

  obtenerEmpleados(): void {
    this.empleadoService.getAllEmpleados().subscribe(
      empleados => this.empleados = empleados,
      error => console.error('Error al obtener los empleados', error)
    );
  }



  // Método para agregar un producto al carrito
  agregarProducto(producto: any): void {
    this.productos.push(producto);
    this.actualizarTotal();
  }

  // Método para eliminar un producto del carrito
  eliminarProducto(index: number): void {
    this.productos.splice(index, 1);
    this.actualizarTotal();
  }

  // Método para actualizar el total del carrito
  actualizarTotal(): void {
   this.total = this.productos.reduce((total:number, producto:Producto) => total + producto.precio, 0);
    this.descuento = this.total * 0.1;
    this.iva = this.total * 0.16;
    this.subtotal = this.total - this.descuento;
    this.totalPagar = this.subtotal + this.iva;
  }

  pagarCredito() {
    // Aquí puedes manejar la lógica de pago a crédito
  }

  cancelarVenta() {
    // Aquí puedes manejar la lógica de cancelación de la venta
  }
}
