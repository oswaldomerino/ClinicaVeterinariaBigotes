import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { ClienteService } from '../../servicios/cliente.service';
import { Observable, map } from 'rxjs';
import { MascotaService } from '../../servicios/mascota.service';
import { GestionVeterinariaService } from '../../servicios/gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FirestoreModule } from '@angular/fire/firestore';
import { Medicamento } from '../../gestionVeterinaria/medicamento/registro-medicamento/registro-medicamento.component';
import { SharedDataGestionVeterinariaService } from '../../servicios/shared-data-gestion-veterinaria.service';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { CanComponentDeactivate, CanDeactivateGuard } from '../../servicios/can-deactivate-guard.service';
import Swal from 'sweetalert2';
import { ModalService } from '../../servicios/modal.service';
import { CobrarModalComponent } from '../../shared/modal/cobrar-modal/cobrar-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TemperamentoModalComponent } from '../../shared/modal/temperamento-modal/temperamento-modal.component';
import { ToastrService } from 'ngx-toastr';
import { SharedDataService } from '../../servicios/shared-data.service';
import { log } from 'console';


interface Producto {
  codigo: string;
  descripcion: string;
  precioUnitario: number;
  cantidad: number;
  descuento: number;
  iva: number;
  total: number;
  precio: number;
}


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
  selector: 'app-tienda',
  standalone: true,
  imports: [NgSelectModule,
        CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,CobrarModalComponent],
    providers: [CanDeactivateGuard,ToastrService],
  templateUrl: './tienda.component.html',
  styleUrl: './tienda.component.css'
})
export class TiendaComponent implements OnInit, CanDeactivateGuard{
  productos!: Producto[] ;
  total:number = 0;
  descuento = 0;
  iva = 0;
  subtotal = 0;
  totalPagar = 0;
  clientes: any[] = [];

  totalVenta = 0;
  descuentoTotal = 0;
  ivaTotal = 0;


  isLoading=false;

  clientesFiltrados: any[] = [];
  clienteSeleccionado: any[] = [];
  mascotas: any[] = [];
  idCliente: string | null = null;
  empleados: any[] = [];

  mascotaSeleccionada: any = {};
  productoSeleccionado: any = {};

  planSaludVigente: boolean = false;
  proximaCita: string | null = 'sin datos';
  vacunas: Vacuna[] = [];
  planSalud: boolean = false;
  fechaVenta: string = '';

  medicamentos: Medicamento[] = [];
  atendidoSelecionado: any;
  constructor(
    private clienteService: ClienteService,
    private mascotasService: MascotaService,
    private empleadoService: GestionVeterinariaService,

    private medicamentoService: GestionVeterinariaService,
    private listaEsperaService: SalaEsperaService,
    private sharedDataService: SharedDataService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef, /* otros servicios inyectados */
  ) { }

  
async canDeactivate(): Promise<boolean> {
  if (this.productos.length > 0) {
    const result = await Swal.fire({
      title: '¿Estás seguro de que quieres salir?',
      text: 'Si cambias de página ahora, los productos en tu lista se perderán.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'No, cancelar'
    });

    return result.isConfirmed;
  }
  return true;
}

  ngOnInit(): void {
    this.clientes = [
      { id: 0, label: 'Venta al público general' },
      // tus otros clientes aquí
    ];

    this.clienteSeleccionado = this.clientes[0].id;





    this.obtenerClientes();
    this.obtenerEmpleados();
    this.obtenerMedicamentos();


    
    this.sharedDataService.atendidoActual.subscribe(atendido => this.atendidoSelecionado = atendido);

    if (this.atendidoSelecionado) {
      this.clienteSeleccionado = this.atendidoSelecionado.cliente.id;
      this.obtenerMascotasPorCliente(this.atendidoSelecionado.cliente);
    
     // this.clienteSeleccionado = this.clientes[0].id;
      this.sharedDataService.cambiarAtendido(this.atendidoSelecionado);
      this.atendidoSelecionado = {};
      
      this.changeDetector.detectChanges();  // Forzar la detección de cambios
    } 

    this.productos=[]
  const fecha = new Date();
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
  this.fechaVenta = fecha.toJSON().slice(0,10);

  
  this.isLoading=false;
   
  }



  obtenerMedicamentos(): void {
    this.medicamentoService.getAllMedicamentos().subscribe(
      medicamentos => this.medicamentos = medicamentos,
      error => console.error('Error al obtener los medicamentos', error)
    );
  }
  
obtenerClientes(): void {
  this.clienteService.getAll().pipe(
    map(clientes => this.ordenarClientesPorFecha(clientes))
  ).subscribe(clientesOrdenados => {
    this.clientes = this.clientesFiltrados = [
      {
        id: '0', // Puedes ajustar este valor según tus necesidades
        label: 'Venta al público general',
        // Agrega aquí cualquier otra propiedad que necesites para un cliente
      },
      ...clientesOrdenados.map(cliente => ({
        ...cliente,
        label: this.getClienteLabel(cliente)
      }))
    ];
  });



  console.log('clientes ',this.clientes);
}

  getClienteLabel(cliente:any) {
    return `${cliente.codigo} - ${cliente.nombres}`;
  }

  ordenarClientesPorFecha(clientes: any): any[] {
    return clientes.sort((a: any, b: any) =>
      new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime()
    );
  }

  obtenerMascotasPorCliente(clienteSeleccionado:any): void {

    this.mascotas= [];
    this.mascotaSeleccionada = {};
    this.productos=[]
    
    if (clienteSeleccionado.id === '0') {
      // Aquí puedes manejar el caso en que el cliente seleccionado es "Venta al público general"
      console.log('El cliente seleccionado es Venta al público general');
this.productos=[]
this.cancelarVenta();
this.calcularTotalVenta()


    }
    else if (clienteSeleccionado.id) {
      this.mascotasService.getMascotasPorCliente(clienteSeleccionado.id).then((mascotas: any[]) => {
        this.mascotas = mascotas;   
              // Seleccionar la mascota en la posición 0 por defecto
      if (this.mascotas.length > 0) {    
        this.infoMascota(this.mascotas[0]);
        this.mascotaSeleccionada = this.mascotas[0].id; // Selecciona la primera mascota por defecto
      }
        if (!this.mascotas.length) {
          //console.log('No hay mascotas disponibles para este cliente.');
        }
      }).catch(error => {
        console.error('Error al obtener mascotas:', error);
      });

      this.isLoading=true;
this.listaEsperaService.getListaEsperaPorClienteYEstado(clienteSeleccionado.id).subscribe((listaEspera: any[]) => {
  if (listaEspera.length) {
    console.log('listaEspera ',listaEspera);
    listaEspera.forEach(lista => {  
      // Si listaEspera.pagado es true, no agregar a producto
      if (!lista.pagado) {
        const producto:any={}
        producto.idListaEspera=lista.id;
        producto.codigo = lista.infoServicio.categoria;
        if (lista.infoServicio.categoria != 'aplicacion') {
          producto.descripcion =   lista.mascota.nombre +  ' - ' + lista.infoServicio.descripcion;
          producto.precio = lista.precio;
          producto.cantidad = 1;
          producto.descuento = 0;
          producto.total = this.calcularTotal(producto);
        } else {  
          producto.descripcion = lista.mascota.nombre +  ' - ' + lista.infoServicio.medicamento;
          producto.precio = lista.infoServicio.precioVacuna;
          producto.cantidad = 1;
          producto.descuento = 0;
          producto.total = this.calcularTotal(producto);
        }

        this.productos.push(producto);
      }
    });
    this.isLoading=false;
    this.calcularTotalVenta()
    this.changeDetector.detectChanges();  // Forzar la detección de cambios
  }else{
    this.isLoading=false;
    this.changeDetector.detectChanges();  // Forzar la detección de cambios
  }
});
    }
  }

  obtenerEmpleados(): void {
    this.empleadoService.getAllEmpleados().subscribe(
      empleados => this.empleados = empleados,
      error => console.error('Error al obtener los empleados', error)
    );
  }


actualizarProducto(producto: any ) {
  const medicamento = this.medicamentos.find(m => m.id === producto.id);
  console.log('medicamento ',medicamento);
  if (medicamento) {
    producto.id=medicamento.id;
    producto.codigo = medicamento.codigoBarras;
    producto.descripcion = medicamento.nombreVacuna;
    producto.precio = medicamento.precio;
    producto.descuento = 0;

    const productoExistente = this.productos.find(p => p.codigo === producto.codigo);
    if (productoExistente) {
      // Si el producto ya está en la lista, aumenta su cantidad
      productoExistente.cantidad += 1;
      productoExistente.total = this.calcularTotal(productoExistente);
    } else {
      // Si el producto no está en la lista, lo agrega
      producto.cantidad = 1;
      producto.total = this.calcularTotal(producto);
      this.productos.push(producto);
    }

    this.calcularTotalVenta()
    this.productoSeleccionado = []; // Suponiendo que 'productoSeleccionado' es la variable que almacena el producto seleccionado
  }
  // Deseleccionar el producto
}


  agregarProducto() {
   // this.productos.push({codigo: '', descripcion: '', cantidad: 0, precio: 0, descuento: 0, iva: 0, total: 0 });
  }


  eliminarProducto(index: number) {
    console.log('index ',index);
    this.productos.splice(index, 1);
    this.calcularTotalVenta()
    this.changeDetector.detectChanges();  // Forzar la detección de cambios
  }

  calcularIVA(producto: any) {
    // Asume un IVA del 21%
    return producto.precio * producto.cantidad * 0.08;
  }

  calcularTotal(producto: any) {

    const subtotal = producto.precio * producto.cantidad;
    const descuento = subtotal * (producto.descuento / 100);
    const iva = this.calcularIVA(producto);
    this.calcularTotalVenta()
    return subtotal - descuento + iva;


  }
  buscarProducto(event: any, index: number) {
    const codigo = event.target.value;
    // Aquí debes implementar la lógica para buscar el producto por su código
    // y actualizar la descripción, precio, etc. del producto en el índice especificado
  }

  calcularTotalVenta() {
    this.totalVenta = this.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad), 0);
    this.descuentoTotal = this.productos.reduce((sum, producto) => sum + (producto.precio * producto.cantidad * (producto.descuento / 100)), 0);
    this.ivaTotal = this.productos.reduce((sum, producto) => sum + this.calcularIVA(producto), 0);
    this.subtotal = this.totalVenta - this.descuentoTotal;
    this.totalPagar = this.subtotal + this.ivaTotal;
    
 
  }


  // Método para obtener información detallada de una mascota
infoMascota(mascota: any): void {
  if (mascota) {


    // Verificar si la mascota tiene vacunas
    if (mascota.vacunas) {
      this.vacunas = this.obtenerUltimaVacunaPorId(mascota.vacunas);
      this.planSalud = true; // La mascota tiene un plan de salud

      // Verificar si el plan de salud de la mascota está vigente
      this.planSaludVigente = this.verificarPlanSalud(this.vacunas[0]);
      this.proximaCita = this.planSaludVigente ? this.vacunas[0].proximaCita : '';
    } else {
      // La mascota no tiene un plan de salud
      this.vacunas = [];
      this.planSalud = false;
      this.planSaludVigente = false;
      this.proximaCita = '';
    }
  }
}

// Función para obtener solo la última vacuna aplicada por cada ID de medicamento
obtenerUltimaVacunaPorId(vacunas: any[]): any[] {
  // Crear un mapa para almacenar las vacunas por ID de medicamento y su fecha de aplicación
  const vacunasPorId = new Map();
  vacunas.forEach(vacuna => {
    // Si no hay ninguna vacuna almacenada para este ID de medicamento o la fecha de aplicación de esta vacuna es más reciente,
    // actualiza la vacuna almacenada para este ID de medicamento con la vacuna actual
    if (!vacunasPorId.has(vacuna.idMedicamento) || new Date(vacuna.fechaAplicacion) > new Date(vacunasPorId.get(vacuna.idMedicamento).fechaAplicacion)) {
      vacunasPorId.set(vacuna.idMedicamento, vacuna);
    }
  });

  // Convertir las vacunas del mapa a un array y devolverlo
  return Array.from(vacunasPorId.values());
}

 // Método privado para verificar si el plan de salud de la mascota está vigente
 private verificarPlanSalud(vacuna: Vacuna): boolean {
  const fechaActual = new Date();
  const partesFecha = vacuna.proximaCita.split('/');
  const dia = +partesFecha[0];
  const mes = +partesFecha[1] - 1;
  const anio = +partesFecha[2];
  const fechaProximaVacuna = new Date(anio, mes, dia);
  return fechaProximaVacuna.getTime() > fechaActual.getTime();
}

  pagarCredito() {
    // Aquí puedes manejar la lógica de pago a crédito
  }

  cancelarVenta() {
    // Aquí puedes manejar la lógica de cancelación de la venta
console.log('cancelar venta'  ,this.clientes);

    this.clienteSeleccionado = this.clientes[0].id;
 
    this.mascotas= [];
    this.mascotaSeleccionada = {};
    this.productos=[]
    this.calcularTotalVenta()
    this.infoMascota(this.mascotaSeleccionada);
    
   
   //this.changeDetector.detectChanges();  // Forzar la detección de cambios
  }


  cobrar() {
      // Solo mostrar el modal si productos tiene elementos
  if (this.productos.length === 0) {
    this.toastr.error('No hay productos para cobrar');
    return;
  }
    const modalRef = this.modalService.open(CobrarModalComponent, { size: 'lg' });
    modalRef.componentInstance.productos = this.productos;
    modalRef.componentInstance.totalPagar = this.totalPagar;
  
    modalRef.result.then((result) => {
      if (result) {
        console.log( 'Venta realizada con éxito' , result);
        console.log('productos en el modal',this.productos);



        const venta = { 
          cliente: this.clienteSeleccionado,
          mascota: this.mascotaSeleccionada,
          productos: this.productos,
          total: this.totalPagar,
          montoEntregado: result.montoEntregado,
          formasPago: result.formasPago,
          fecha: this.fechaVenta,
        //  empleado: this.empleados[0].id
        } 


console.log('venta ',venta);

this.listaEsperaService.realizarVenta(venta,this.productos).then(() => {
  // Cerrar el modal y pasar la mascota actualizada
Swal.fire(
  '¡Venta realizada!',
  'La transacción de la venta ha sido realizada exitosamente.',
  'success'
);
this.imprimirTicket(venta)

this.cancelarVenta();
}).catch((error) => {
  console.error('Error en la transacción:', error);
});




/*
        this.productos.forEach((productos:any) => {

          
          if(productos.idListaEspera){
            const producto:any = {
              id: productos.idListaEspera,
              pagado: true
            }
            console.log('servicios que se van a pagar ',producto);
          }else{
            const producto:any = {
              id: productos.id,
              producto: productos.descripcion,
              descontarSrock: productos.cantidad
            }
            console.log('productos que se van a descontar ',producto);
          }


   
          //this.updateStatus(producto)
        });

*/

        // Aquí puedes manejar la respuesta del modal
      }
    }, (reason) => {
      // Aquí puedes manejar el caso en que el modal se cierre sin devolver un resultado
    });
  }


  updateStatus(servAtendido:any){

    const horaActual = new Date();


  }

  imprimirTicket(venta: any) {
    const cliente = this.clientes.find(cliente => cliente.id === this.clienteSeleccionado);
    const nombreCliente = cliente ? cliente.nombres[0] : 'Cliente no encontrado';
    const direccionCliente = cliente?.direccion || 'Dirección no proporcionada';

    // Calcular el cambio
    const cambio = (venta.montoEntregado || 0) - venta.total;

    // Crear una nueva ventana para mostrar el ticket
    const mywindow = window.open('', 'PRINT', 'height=600,width=800');

    if (mywindow!) {
        // Encabezado del documento HTML
        mywindow!.document.write(`
            <html>
            <head>
                <title>Factura - Clinica Vet. Bigotes</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        margin: 0;
                        padding: 0;
                        background-color: #f3f4f6;
                        color: #333;
                    }
                    .container {
                        max-width: 800px;
                        margin: 20px auto;
                        background: #ffffff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header img {
                        max-width: 120px;
                        margin-bottom: 10px;
                    }
                    .header h1 {
                        font-size: 1.8rem;
                        color: #015d52;
                        margin: 0;
                    }
                    .header p {
                        font-size: 1rem;
                        color: #666;
                    }
                    .details {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
                    .card {
                        flex: 0 0 48%;
                        border: 1px solid #dee2e6;
                        border-radius: 8px;
                        padding: 10px;
                        background: #f9f9f9;
                    }
                    .card h2 {
                        font-size: 1.1rem;
                        margin-bottom: 10px;
                        color: #015d52;
                    }
                    .card p {
                        margin: 5px 0;
                        font-size: 0.9rem;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 20px;
                    }
                    table th, table td {
                        border: 1px solid #dee2e6;
                        padding: 10px;
                        text-align: left;
                        font-size: 0.9rem;
                    }
                    table th {
                        background-color: #015d52;
                        color: #ffffff;
                        font-weight: bold;
                    }
                    .footer {
                        text-align: right;
                        font-size: 1rem;
                        font-weight: bold;
                        color: #015d52;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <!-- Encabezado con logo y datos de la clínica -->
                    <div class="header">
                        <img src="assets/image.png" alt="Logo Veterinaria">
                        <h1>Clinica Vet. Bigotes</h1>
                        <p>Morelia 203, Col. Roma, Piedras Negras, México</p>
                        <p>Teléfono: 878 782 3342</p>
                    </div>

                    <!-- Detalles de la venta y del cliente -->
                    <div class="details">
                        <!-- Detalles de la venta -->
                        <div class="card">
                            <h2>Detalles de la Venta</h2>
                            <p><strong>ID de la venta:</strong> ${venta.id || 'N/A'}</p>
                            <p><strong>Fecha:</strong> ${venta.fecha || 'N/A'}</p>
                            <p><strong>Forma de pago:</strong> ${venta.formasPago || 'Efectivo'}</p>
                            <p><strong>Total pagado:</strong> $${(venta.montoEntregado || 0).toFixed(2)}</p>
                        </div>

                        <!-- Detalles del cliente -->
                        <div class="card">
                            <h2>Detalles del Cliente</h2>
                            <p><strong>Nombre:</strong> ${nombreCliente}</p>
                            <p><strong>Dirección:</strong> ${direccionCliente}</p>
                        </div>
                    </div>

                    <!-- Tabla de productos -->
                    <h2>Productos</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Cantidad</th>
                                <th>Precio</th>
                            </tr>
                        </thead>
                        <tbody>
        `);

        // Iterar sobre los productos y añadir filas a la tabla
        venta.productos.forEach((producto: any) => {
            mywindow!.document.write(`
                <tr>
                    <td>${producto.descripcion}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${producto.precio.toFixed(2)}</td>
                </tr>
            `);
        });

        // Finalizar la tabla y añadir el total y el cambio
        mywindow!.document.write(`
                        </tbody>
                    </table>

                    <!-- Total y cambio -->
                    <div class="footer">
                        <p><strong>Total:</strong> $${venta.total.toFixed(2)}</p>
                        <p><strong>Cambio:</strong> $${(cambio > 0 ? cambio.toFixed(2) : '0.00')}</p>
                    </div>
                </div>
            </body>
            </html>
        `);

        // Cerrar y abrir la ventana de impresión
        mywindow!.document.close();
        mywindow.focus();
        mywindow.print();
        mywindow.close();

        return true;
    }
    return false;
}






  

  
  
}
