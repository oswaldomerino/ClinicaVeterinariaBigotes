import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

import { Servicio } from '../../interfaces/servicios-veterinarios.interface';
import { SharedDataService } from '../../../servicios/shared-data.service';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SalaEsperaService } from '../../../servicios/sala-espera.service';
import { MascotaService } from '../../../servicios/mascota.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { Empleado } from '../../interfaces/empleado.interface';
import { ReactiveFormsModule, FormsModule, FormGroup, FormBuilder } from '@angular/forms';



interface PesoRegistro {
  peso: number;
  fecha: Date;
}


@Component({
  selector: 'app-selecionar-servicio-modal',
  standalone: true,
  imports: [ CommonModule,ReactiveFormsModule,FormsModule,NgbModule,NgSelectModule,],
  templateUrl: './selecionar-servicio-modal.component.html',
  styleUrl: './selecionar-servicio-modal.component.css'
})
export class SelecionarServicioModalComponent {
  private subscriptions: Subscription[] = [];
  nombreCliente!: string;
  nombreMascota!: string;
  cliente!: any
  mascota!: any
  empleados:Empleado[]=[]
  listaEspera!:any
  listaEsperaForm: FormGroup;
  servicios: Servicio[] = []; // Asegúrate de tener una interfaz o clase Servicio
  precio: number=0;
  mostrarTallaCampo: boolean = false;
// En tu componente TypeScript
  mostrarPrecioCampo: boolean = false; // Inicializar como false si deseas que el campo esté inicialmente deshabilitado
  historialPesos:PesoRegistro[]=[]
  textoFecha: string = ''; // Variable para almacenar el texto con la fecha

 
  loadingDescripciones = false; // Indicador de carga de descripciones
  descripciones: any[] = [];
  selectDescripciones: any[] = [];
  subscription: any;
  mostrarCostrosExtras: boolean = false; // Inicializar como false si deseas que el campo esté inicialmente deshabilitado
  selectedCostoExtra: any[]=[];
    itemsCostoExtra:any = [];

    totalCostoExtra = 0;



  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private mascotaService: SharedDataService,
    private toastr: ToastrService,
    private _servicio: GestionVeterinariaService,
    private _listEspetaFB: SalaEsperaService,
    private mascotaCRUD: MascotaService,
    private descripcionService:GestionVeterinariaService,
    private empleadoService:GestionVeterinariaService
  ) {
    this.listaEsperaForm = this.formBuilder.group({
      // Define tus controles aquí
    });
  }

  ngOnInit(): void {
    this.cargarServicios()

    this.listaEsperaForm = this.formBuilder.group({
      servicio: [''],
      atendidoPor: [[]],
      descripciones: [[]],
      peso: [''],
      precio: [{value:'', disabled:true}],
      // Tus otros campos aquí...
    costosExtras:[{}],
    });
    

  




this.consultarDescripciones();
this.cargarEmpleados();
    
  

    this.subscriptions.push(
      this.mascotaService.clienteActual.subscribe(cliente => {
        if (cliente) {
          this.cliente = cliente
          this.nombreCliente = cliente.nombres[0]
        }
      }, error => {
        this.toastr.error('Error al obtener los datos del cliente.', 'Error');
      }),
      this.mascotaService.mascotaSeleccionadoObservable.subscribe(mascota => {
        if (mascota) {
          this.mascota = mascota
          this.nombreMascota = mascota.nombre;
          this.listaEsperaForm.controls['peso'].setValue(this.mascota.peso);
          const historialPesos = mascota.historialPesos; // Obtener el historial de pesos de la mascota
          this.historialPesos=historialPesos
          if (historialPesos && historialPesos.length > 0) {
            // Si hay registros en el historial de pesos
            const ultimoRegistro = historialPesos[historialPesos.length - 1]; // Obtener el último registro
          
            const timestamp = ultimoRegistro.fecha; // Suponiendo que esto es un objeto _Timestamp
            const fechaUltimoPeso = new Date(timestamp.seconds * 1000); // Convertir a milisegundos

            const fechaComoCadena = fechaUltimoPeso.toLocaleString();
            console.log(fechaComoCadena); // Imprime la fecha en el formato local
            this.textoFecha = `Último peso registrado el ${fechaComoCadena}`;

          } else {
            // Si no hay registros en el historial de pesos
            this.textoFecha = 'No se han registrado pesos aún'; // Mensaje por defecto si no hay registros
          }
        }
      }, error => {
        this.toastr.error('Error al obtener los datos de la mascota.', 'Error');
      })
      
      
    );



    
  }
  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarServicios(): void {
    this._servicio.getAll().subscribe(servicios => {
      this.servicios = servicios;
    });
  }

  toggleTallaField(): void {
    const { servicio } = this.listaEsperaForm.value;
    const servicioSeleccionado = this.servicios.find(serv => serv.id === servicio);
   
    if(servicioSeleccionado){
      this.cargarCostosExtras(servicioSeleccionado)
        if (servicioSeleccionado.tipoPrecio === 'unitario') {
            this.mostrarPrecioCampo=true;
            // Si es un precio unitario, tomar el precio directamente del servicio
            this.precio = servicioSeleccionado.precioUnitario;
            this.listaEsperaForm.controls['precio'].setValue(this.precio);
        } else {
            this.mostrarTallaCampo=true;
            this.mostrarPrecioCampo=true;
            const pesoMascota = this.listaEsperaForm.controls['peso'].value || 0;

            // Verificar si se tiene el peso de la mascota
            if (pesoMascota !== null) {
                // Iterar sobre los rangos de peso del servicio para determinar el precio
                for (const rango of servicioSeleccionado.precios) {
                    if (pesoMascota >= rango.rangoPesoInicio && pesoMascota <= rango.rangoPesoFin) {
                        // Si el peso de la mascota está dentro del rango, asignar el precio correspondiente
                        this.precio = rango.precio;
                        break; // Salir del bucle una vez que se haya encontrado el precio
                    }
                }
                this.listaEsperaForm.controls['precio'].setValue(this.precio);
            } else {
                // Si no se tiene el peso de la mascota, asignar un precio predeterminado
                this.precio = 0; // Puedes cambiar esto según tu lógica
            }
        }
    }
}

handlePesoChange(event: any): void {
  // Llama a toggleTallaField() cuando cambia el peso de la mascota
  this.toggleTallaField();
  const pesoMascota = this.listaEsperaForm.controls['peso'].value || 0;
  this.agregarNuevoPeso(pesoMascota)
}

agregarNuevoPeso(peso: number): void {
  const nuevoRegistro: PesoRegistro = {
    peso: peso,
    fecha: new Date() // La fecha actual
  };
  this.historialPesos.push(nuevoRegistro);
  this.mascota.historialPesos=this.historialPesos;
  this.mascota.peso=peso;
  this.updatePeso()
}

updatePeso(){
          // Lógica para editar la mascota en la base de datos
          this.mascotaCRUD.updateMascota(this.mascota.id, this.mascota).subscribe(() => {
            this.toastr.success('¡Mascota editada!', 'La mascota se ha editado correctamente.');

  
            // Puedes agregar aquí más lógica después de editar la mascota
          }, error => {
            console.error('Error al editar mascota en la base de datos:', error);
            this.toastr.error('¡Error!', 'Hubo un error al editar la mascota. Por favor, inténtalo de nuevo más tarde.');
          });
        
}


  toggleTallaField1(): void {
    const {servicio } = this.listaEsperaForm.value;
    const servicioSeleccionado = this.servicios.find(serv => serv.id === servicio);

if(servicioSeleccionado){
  if (servicioSeleccionado.tipoPrecio === 'unitario') {
    this.mostrarPrecioCampo=true
    // Si es un precio unitario, tomar el precio directamente del servicio
    this.precio = servicioSeleccionado.precioUnitario;
    console.log(this.precio)
    this.listaEsperaForm.controls['precio'].setValue(this.precio);
    this.listaEsperaForm.controls['peso'].setValue(this.mascota.peso);
  } else {
    this.mostrarTallaCampo=true;
    this.mostrarPrecioCampo=true
    const pesoMascota = this.mascota.peso !== undefined ? this.mascota.peso : 0;
    this.listaEsperaForm.controls['peso'].setValue(pesoMascota);

          // Verificar si se tiene el peso de la mascota
          if (pesoMascota !== null) {
            // Iterar sobre los rangos de peso del servicio para determinar el precio
            for (const rango of servicioSeleccionado.precios) {
              if (pesoMascota >= rango.rangoPesoInicio && pesoMascota <= rango.rangoPesoFin) {
                // Si el peso de la mascota está dentro del rango, asignar el precio correspondiente
                this.precio = rango.precio;
                break; // Salir del bucle una vez que se haya encontrado el precio
              }
            }
            this.listaEsperaForm.controls['precio'].setValue(this.precio);
          } else {
            // Si no se tiene el peso de la mascota, asignar un precio predeterminado
            this.precio = 0; // Puedes cambiar esto según tu lógica
          }

    // Si no, se necesita capturar el peso para calcular el precio
    // Aquí puedes agregar la lógica para capturar el peso y calcular el precio en base a él
    // Por ahora, asignaremos un valor predeterminado

  }
}

  }



  registrarLista(): void {

    // Obtener los valores del formulario
    const { atendidoPor, descripciones, servicio , peso, precio, costosExtras } = this.listaEsperaForm.value;


    const listaEspera= this.listaEsperaForm.value

    // Preparar los datos del cliente y la mascota
    const clienteData = { nombre: this.nombreCliente, id: this.cliente.id };
    const pesoMascota = this.mascota.peso !== undefined ? this.mascota.peso : 0;
    const mascotaData = { nombre: this.nombreMascota, id: this.mascota.id, peso:pesoMascota};

    
    // Buscar el servicio seleccionado por su ID
    const servicioSeleccionado = this.servicios.find(serv => serv.id === servicio);
 // Agregar los costos extras seleccionados al array de costosExtrasSeleccionados

// Obtener la hora actual
const horaActual = new Date();





 listaEspera.cliente=clienteData
 listaEspera.mascota=this.mascota
 listaEspera.infoServicio=servicioSeleccionado
 listaEspera.horaRecepcion= horaActual.toISOString()
 listaEspera.status='en espera'
 listaEspera.costosExtras= this.selectedCostoExtra
 listaEspera.precio= this.precio
 listaEspera.costoTotal = this.totalCostoExtra + this.precio
listaEspera.atendidoPor=atendidoPor
console.log('this.selectedCostoExtra d ' , this.selectedCostoExtra)
    


 
    // Crear el objeto con los datos a enviar al servicio
    const listaEsperaItem = {
      servicio,
      costosExtras:this.selectedCostoExtra, // Agregar los costos extras seleccionados
      cliente: clienteData,
      mascota: mascotaData,
      veterinario: atendidoPor, // Supongamos que atendidoPor se refiere al veterinario
      descripcion: descripciones,
      horaRecepcion: horaActual.toISOString(), // Convertir la hora a una cadena ISO
      horaCita: '', // Puedes agregar lógica para establecer la hora de la cita
      peso, // Puedes agregar lógica para capturar el peso
      precio: this.precio, // Puedes agregar lógica para capturar el precio
      infoServicio:servicioSeleccionado,
      status:'en espera'
      // Agregar otros campos si es necesario, como hora de la cita, mensaje, peso, precio, etc.
    };

    // Llamar al servicio para agregar el cliente a la lista de espera
    this._listEspetaFB.agregarItemList(listaEspera)
      .then(() => {
        this.toastr.success('Cliente registrado en lista de espera correctamente.', 'Éxito');
        const result={modal:'addListaEspera', valor:listaEsperaItem}
      this.activeModal.close(result);
      })
      .catch(error => {
        this.toastr.error('Error al registrar cliente en lista de espera.', 'Error');
        console.error('Error:', error);
      });
  }



  closeModal(): void {
    this.activeModal.close();
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
  
  consultarDescripciones(): void {
    // Consultar las descripciones desde Firebase
    this.descripcionService.getAllDescripciones().subscribe(descripciones => {
        // Verificar si descripciones es un array
        if (Array.isArray(descripciones)) {
            // Mapear las descripciones obtenidas para asignarles un ID único
            this.descripciones = descripciones.map((descripcion: any, index: number) => ({ id: descripcion.nombre, name: descripcion.nombre }));
            console.log(this.descripciones);
        } else {
            console.error('El valor de "descripciones" no es un array:', descripciones);
        }
    });
  }

  cargarEmpleados(){
    this.empleadoService.getAllEmpleados().subscribe(
      empleado => this.empleados = empleado,
      error => console.error('Error al obtener los empleados', error)
    );
  }

  cargarCostosExtras(servicio: Servicio): void {
    // Si el servicio existe y tiene costos extras, los carga
    if (servicio && servicio.costosExtras) {
      this.itemsCostoExtra = servicio.costosExtras;
      this.mostrarCostrosExtras=true
    } else {
      // Si el servicio no existe o no tiene costos extras, limpia los costos extras
      this.itemsCostoExtra = [];
      this.mostrarCostrosExtras=false
    }
  }


  

onClear() {
 
}

  seleccionarCostoExtra(costoExtra:any): void {

    
  }

  onAddCostoExtra(costoExtra:any){
    // Comprueba si el costo extra ya ha sido seleccionado
    if (this.selectedCostoExtra.some(item => item.nombre === costoExtra.nombre)) {
      // Si ya ha sido seleccionado, muestra un mensaje toast y no hagas nada más
      this.toastr.warning('Este costo extra ya ha sido seleccionado');
      return;
  }

  // Si no ha sido seleccionado, agrégalo a la lista y actualiza el total
  this.selectedCostoExtra.push(costoExtra);
  console.log('add',this.selectedCostoExtra)
  this.totalCostoExtra += costoExtra.precio;
  }

  onARemoveCostoExtra(costoExtra:any){

    const index = this.selectedCostoExtra.indexOf(costoExtra);
    if (index > -1) {
      this.selectedCostoExtra.splice(index, 1);
      this.totalCostoExtra -= costoExtra.precio;
    }
    console.log('remove',this.selectedCostoExtra)
  
    
  }

  eliminarCostoExtra(index:any) {
    let item = this.selectedCostoExtra[index];
    this.totalCostoExtra -= item.precio;
    this.selectedCostoExtra.splice(index, 1);
  }
  


  

}
