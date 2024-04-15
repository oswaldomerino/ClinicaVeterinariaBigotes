import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FirebaseModule } from '../../../firebase/firebase.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SharedDataService } from '../../../servicios/shared-data.service';
import { Servicio } from '../../interfaces/servicios-veterinarios.interface';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { MascotaService } from '../../../servicios/mascota.service';
import { SalaEsperaService } from '../../../servicios/sala-espera.service';
import { formatDate } from 'date-fns';
import { ClienteDetalleComponent } from '../../../clientes/cliente-detalle/cliente-detalle.component';
import { MascotaDetalleComponent } from '../../../mascotas/mascota-detalle/mascota-detalle.component';
import { Empleado } from '../../interfaces/empleado.interface';


interface PesoRegistro {
  peso: number;
  fecha: Date;
}

@Component({
  selector: 'app-selecionar-aplicacion',
  standalone: true,
  imports: [ CommonModule,ReactiveFormsModule,FormsModule,NgbModule,NgSelectModule, ClienteDetalleComponent, MascotaDetalleComponent],
  providers:[ToastrService,FirebaseModule],
  templateUrl: './selecionar-aplicacion-modal.component.html',
  styleUrl: './selecionar-aplicacion-modal.component.css'
})
export class SelecionarAplicacionModalComponent {
  private subscriptions: Subscription[] = [];
  nombreCliente!: string;
  nombreMascota!: string;
  cliente!: any
  mascota!: any
  empleados:Empleado[]=[]
  listaEsperaForm: FormGroup;
  servicios: Servicio[] = []; // Asegúrate de tener una interfaz o clase Servicio
  precio: number = 0;
  mostrarTallaCampo: boolean = false;
  // En tu componente TypeScript
  mostrarPrecioCampo: boolean = false; // Inicializar como false si deseas que el campo esté inicialmente deshabilitado
  historialPesos: PesoRegistro[] = []
  textoFecha: string = ''; // Variable para almacenar el texto con la fecha
modoedicion:boolean=false;

  loadingDescripciones = false; // Indicador de carga de descripciones
  descripciones: any[] = [];
  selectDescripciones: any[] = [];

  medicamentos: any[] = [];
  formulario!: FormGroup;
  opcionesMedicamentosVacunas: { value: string, label: string }[] = [];
  medicamentosVacunas: any[] = [];
  medicamentoSeleccionado: any = null;

  idServicio!:string;

  aplicaion!: any;
  subscription: any;



  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private mascotaService: SharedDataService,
    private toastr: ToastrService,
    private firebase: GestionVeterinariaService,
    private _listEspetaFB: SalaEsperaService,
    private mascotaCRUD: MascotaService,
    private descripcionService:GestionVeterinariaService,
    private empleadoService:GestionVeterinariaService
  ) {

    this.listaEsperaForm = this.formBuilder.group({
      // Define tus controles aquí
    });

    // Dentro de tu componente, puedes usar la función formatDate para obtener la fecha actual ajustada a la zona horaria local
    const fechaActual = formatDate(new Date(), 'yyyy-MM-dd');
    // Luego, puedes usar la fecha actual en la inicialización de tu formulario

    this.formulario = this.formBuilder.group({
      filtroMedicamentoVacuna: [''],
      medicamentoVacuna: [''],
      fechaAplicacion: [fechaActual],// Inicializa con la fecha de hoy
      periodicidad: [''],
      proximaCita: [''],
      peso: [''],
      precioVacuna: [''],
      estadoVacuna: [''],
      atendidoPor: [[]],
      descripciones: [[]],
    });

    // Suscribirse a los cambios en los campos de fecha de aplicación y periodicidad
    this.formulario.get('fechaAplicacion')?.valueChanges.subscribe(() => {
      this.actualizarProximaCita();
    });

    this.formulario.get('periodicidad')?.valueChanges.subscribe(() => {
      this.actualizarProximaCita();
    });

    this.formulario.get('medicamentoVacuna')?.valueChanges.subscribe(value => {
      // Obtener el medicamento seleccionado
      this.medicamentoSeleccionado = this.medicamentos.find(medicamento => medicamento.id === value);
      if (this.medicamentoSeleccionado) {
        // Asignar la periodicidad al campo correspondiente en el formulario
        const fechaAplicacion = this.formulario.get('fechaAplicacion')?.value;
        const periodicidad = this.medicamentoSeleccionado.periodicidad;
        const precio = this.medicamentoSeleccionado.precio;
        this.formulario.get('periodicidad')?.setValue(periodicidad);
        this.formulario.get('precioVacuna')?.setValue(precio);
      }
    });

  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  actualizarProximaCita() {
    // Obtener la fecha de aplicación y la periodicidad del formulario
    const fechaAplicacion = this.formulario.get('fechaAplicacion')?.value;
    const periodicidad = this.formulario.get('periodicidad')?.value;

    // Verificar que ambas fechas sean válidas
    if (fechaAplicacion && periodicidad) {
      // Convertir la fecha de aplicación a objeto Date
      const fecha = new Date(fechaAplicacion);

      // Sumar la periodicidad en días a la fecha de aplicación
      fecha.setDate(fecha.getDate() + parseInt(periodicidad)); // Asegúrate de convertir la periodicidad a número

      // Obtener los componentes de la fecha (día, mes, año)
      const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses comienzan desde 0
      const anio = fecha.getFullYear();

      // Formatear la nueva fecha como "dd/mm/aaaa"
      const proximaCita = `${dia}/${mes}/${anio}`;

      // Asignar la nueva fecha al campo de próxima cita en el formulario
      this.formulario.get('proximaCita')?.setValue(proximaCita);
    }
  }




  ngOnInit(): void {
    this.obtenerClienteMascota()
    this.cargarOpcionesMedicamentosVacunas();
    this.consultarDescripciones();
this.cargarEmpleados();

  }
  cargarOpcionesMedicamentosVacunas() {
    // Lógica para cargar las opciones de medicamentos y vacunas desde Firebase
    this.firebase.getAllMedicamentos().subscribe(medicamentos => {
      this.llenarMedicamentos(medicamentos)

      this.medicamentosVacunas = medicamentos.map((med: any) => ({ id: med.id, nombreVacuna: med.nombreVacuna }));
      this.actualizarOpcionesMedicamentosVacunas();

    });

  }

  llenarMedicamentos(medicamneto: any) {
    this.medicamentos = [...medicamneto];
    console.log('todos', this.medicamentos)
  }

  actualizarOpcionesMedicamentosVacunas() {
    // Inicialmente, mostrar todos los medicamentos y vacunas
    this.opcionesMedicamentosVacunas = this.medicamentosVacunas.map(opcion => ({ value: opcion.id, label: opcion.nombreVacuna }));

  }

  filtrarMedicamentos() {
    const filtro = this.formulario.get('filtroMedicamentoVacuna')?.value.toLowerCase();
    this.opcionesMedicamentosVacunas = this.medicamentosVacunas
      .filter(opcion => opcion.nombreVacuna.toLowerCase().includes(filtro))
      .map(opcion => ({ value: opcion.id, label: opcion.nombreVacuna }));

    // Cambiar la selección si el valor filtrado actualmente seleccionado ya no es visible
    const valorSeleccionado = this.formulario.get('medicamentoVacuna')?.value;
    if (valorSeleccionado && !this.opcionesMedicamentosVacunas.some(opcion => opcion.value === valorSeleccionado)) {
      this.formulario.get('medicamentoVacuna')?.patchValue(null); // Limpiar la selección
    }
  }


  obtenerClienteMascota() {
    this.subscriptions.push(
      this.mascotaService.clienteActual.subscribe(cliente => {
        if (cliente) {
          this.cliente = cliente
          this.nombreCliente = cliente.nombres[0]
        }
      }, error => {
        this.toastr.error('Error al obtener los datos del cliente.', 'Error');
      }),

      this.mascotaService.servicioSeleccionadoObservable.subscribe(serv => {
        if (serv) {
          console.log(' el servi es con su id ' +serv.id ,serv)
          this.modoedicion=true;
          this.idServicio=serv.id;

          console.log(this.idServicio +'  ' +  this.modoedicion)
          // Utiliza patchValue para actualizar los valores del formulario
          this.formulario.patchValue({
            filtroMedicamentoVacuna: serv.infoServicio.medicamento,
            medicamentoVacuna: serv.infoServicio.medica,
            fechaAplicacion: serv.infoServicio.fechaAplicacion, // Asegúrate de que la fecha esté en el formato correcto
            periodicidad: serv.infoServicio.periodicidad,
            proximaCita: serv.infoServicio.proximaCita,
            peso: serv.infoServicio.peso,
            precioVacuna: serv.infoServicio.precioVacuna,
            comentario: serv.infoServicio.comentario,
            estadoVacuna: serv.infoServicio.estadoVacuna
          });
        }
      }, error => {
        this.toastr.error('Error al obtener los datos del servicio.', 'Error');
      }),
      

      this.mascotaService.mascotaSeleccionadoObservable.subscribe(mascota => {
        if (mascota) {
          this.mascota = mascota
          this.nombreMascota = mascota.nombre;
          this.formulario.controls['peso'].setValue(this.mascota.peso);
          const historialPesos = mascota.historialPesos; // Obtener el historial de pesos de la mascota
          this.historialPesos = historialPesos
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

    if (!this.cliente) {
      // Si el cliente es undefined, asigna un objeto vacío o toma otra acción adecuada
      this.cliente = {}; // Otra opción: this.cliente = null;
    }
    if (!this.mascota) {
      console.log(this.mascota.id)
      // Si el cliente es undefined, asigna un objeto vacío o toma otra acción adecuada
      this.mascota = {}; // Otra opción: this.cliente = null;
    }
  }

  calcularProximaCita(fechaAplicacion: Date, periodicidad: number): Date {
    // Lógica para calcular la próxima cita
    const fecha = new Date(fechaAplicacion);
    fecha.setDate(fecha.getDate() + periodicidad);
    return fecha;
  }

  // Método para actualizar la lista de espera después de aplicar la vacuna
actualizarListaEspera() {
  const listaEsperaItem = { ...this.formulario.value, status: 'terminado' };
  this._listEspetaFB.agregarItemList(listaEsperaItem)
    .then(() => {
      this.toastr.success('Lista de espera actualizada correctamente.', 'Éxito');
      // Aquí puedes agregar lógica adicional si es necesario
    })
    .catch(error => {
      this.toastr.error('Error al actualizar la lista de espera.', 'Error');
      console.error('Error:', error);
    });
}



  guardarVacuna() {
    if (this.medicamentoSeleccionado) {
      const { atendidoPor, descripciones, servicio , peso, precio, costosExtras } = this.formulario.value;

      const datosVacuna = {
        idMedicamento: this.medicamentoSeleccionado.id,
        medicamento: this.medicamentoSeleccionado.nombreVacuna,
        fechaAplicacion: this.formulario.get('fechaAplicacion')?.value,
        periodicidad: this.medicamentoSeleccionado.periodicidad,
        proximaCita: this.formulario.get('proximaCita')?.value,
        peso: this.formulario.get('peso')?.value,
        precioVacuna: this.formulario.get('precioVacuna')?.value,
        comentario: descripciones,
        estadoVacuna: this.formulario.get('estadoVacuna')?.value
      };

      this.registrarLista()
  const status= this.formulario.get('estadoVacuna')?.value
      if(status=='en_espera'){
       
      }else{


     // Inicializa el arreglo de vacunas si no existe
     this.mascota.vacunas = this.mascota.vacunas || [];
  
     // Añade la vacuna a la lista de vacunas de la mascota
     this.mascota.vacunas.push(datosVacuna);
 
     // Actualiza el peso de la mascota
     this.mascota.peso = this.formulario.get('peso')?.value;
 
     // Guarda los datos en la base de datos
     this.firebase.insertVacunas(this.mascota.id, this.mascota)
       .subscribe(() => {
         Swal.fire('¡Cliente actualizado!', 'El cliente se ha actualizado correctamente.', 'success');
       }, error => {
         console.error('Error al editar mascota en la base de datos:', error);
         Swal.fire('¡Error!', 'Hubo un error al editar la mascota. Por favor, inténtalo de nuevo más tarde.', 'error');
       });
      }



 
    }
  }

  registrarLista(): void {

    const status= this.formulario.get('estadoVacuna')?.value
    var lista:string='';
    if(status=='en_espera'){
      lista='en espera'
    }else{
      lista='atendido'
    }
    console.log('modo edicion y que debo modif',this.idServicio +'  ' +  this.modoedicion)
    const datosVacuna = {
      idMedicamento: this.medicamentoSeleccionado.id,
      medicamento: this.medicamentoSeleccionado.nombreVacuna,
      fechaAplicacion: this.formulario.get('fechaAplicacion')?.value,
      periodicidad: this.medicamentoSeleccionado.periodicidad,
      proximaCita: this.formulario.get('proximaCita')?.value,
      peso: this.formulario.get('peso')?.value,
      precioVacuna: this.formulario.get('precioVacuna')?.value,
    //  comentario: this.formulario.get('comentario')?.value,
      estadoVacuna: this.formulario.get('estadoVacuna')?.value,
      categoria:'aplicacion'
    };

    // Obtener los valores del formulario
    //const { atendidoPor, descripciones, servicio , peso, precio } = this.listaEsperaForm.value;


    // Obtener los valores del formulario
    const { atendidoPor, descripciones, servicio , peso, precio, costosExtras } = this.formulario.value;


//  const listaEspera= this.listaEsperaForm.value


    // Preparar los datos del cliente y la mascota
    const clienteData = { nombre: this.nombreCliente, id: this.cliente.id ,telefonos: this.cliente.telefonos};
    const pesoMascota = this.mascota.peso !== undefined ? this.mascota.peso : 0;
    const mascotaData = { nombre: this.nombreMascota, id: this.mascota.id, peso:pesoMascota};


    // Buscar el servicio seleccionado por su ID
    //const servicioSeleccionado = this.servicios.find(serv => serv.id === servicio);


    // Obtener la hora actual
    const horaActual = new Date();
 
    // Crear el objeto con los datos a enviar al servicio
    const listaEsperaItem = {
      servicio:this.medicamentoSeleccionado.id,
      cliente: clienteData,
      mascota: mascotaData,
      veterinario:'', // Supongamos que atendidoPor se refiere al veterinario
      descripciones: descripciones,
      horaRecepcion: horaActual.toISOString(), // Convertir la hora a una cadena ISO
      horaCita: '', // Puedes agregar lógica para establecer la hora de la cita
      peso:this.formulario.get('peso')?.value, // Puedes agregar lógica para capturar el peso
      costoTotal: this.formulario.get('precioVacuna')?.value, // Puedes agregar lógica para capturar el precio
      infoServicio:datosVacuna,
      atendidoPor: atendidoPor,
      status:lista
      // Agregar otros campos si es necesario, como hora de la cita, mensaje, peso, precio, etc.
    };


    if(this.modoedicion){
      const hora=horaActual.toISOString()
      this._listEspetaFB.updateListaEspera(this.idServicio, {status: 'atendido',horaAtencion:hora,descripciones:descripciones, })
      .subscribe(() => {
        this.toastr.success('Cliente registrado en lista de espera correctamente.', 'Éxito');
        const result={modal:'addListaEspera', valor:listaEsperaItem}
      this.activeModal.close(result);
      }, error => {
        console.error('Error al editar cliente en la base de datos:', error);
        this.toastr.error('Error al registrar cliente en lista de espera.', 'Error');
      });
    }else{
    // Llamar al servicio para agregar el cliente a la lista de espera
    this._listEspetaFB.agregarItemList(listaEsperaItem)
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

  }
  

  guardarVacuna1() {
    console.log('que tengo', this.medicamentoSeleccionado)
    if (this.medicamentoSeleccionado) {
      const datosVacuna = {
        idMedicamento: this.medicamentoSeleccionado.id,
        medicamento: this.medicamentoSeleccionado.nombreVacuna,
        fechaAplicacion: this.formulario.get('fechaAplicacion')?.value,
        periodicidad: this.medicamentoSeleccionado.periodicidad,
        proximaCita: this.formulario.get('proximaCita')?.value,
        peso: this.formulario.get('peso')?.value,
        precioVacuna: this.formulario.get('precioVacuna')?.value,
        comentario: this.formulario.get('comentario')?.value
      };
      // Verificar si ya existe un arreglo de vacunas en la mascota, si no existe, crearlo
      if (!this.mascota.vacunas) {
        this.mascota.vacunas = [];
      }
      this.mascota.vacunas.push(datosVacuna);
      this.mascota.peso = this.formulario.get('pesoMascota')?.value
      console.log('guarda', datosVacuna)
      // Suponiendo que tienes el ID de la mascota en una variable llamada "idMascota"
      this.firebase.insertVacunas(this.mascota.id, this.mascota)
        .subscribe(() => {
          console.log('Cliente actualizado')
          Swal.fire('¡Cliente actualizado!', 'El cliente se ha actualizado correctamente.', 'success');
          // Lógica adicional si es necesario
        }, error => {
          console.error('Error al editar mascota en la base de datos:', error);
          Swal.fire('¡Error!', 'Hubo un error al editar la mascota. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
    }
  }

  closeModal(): void {
    this.activeModal.close();
  }

  cargarEmpleados(){
    this.empleadoService.getAllEmpleados().subscribe(
      empleado => this.empleados = empleado,
      error => console.error('Error al obtener los empleados', error)
    );
  }

    
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

  handlePesoChange(event: any): void {
    // Llama a toggleTallaField() cuando cambia el peso de la mascota
    this.toggleTallaField();
    const pesoMascota = this.listaEsperaForm.controls['peso'].value || 0;
    this.agregarNuevoPeso(pesoMascota)
  }

  
  toggleTallaField(): void {
    const { servicio } = this.listaEsperaForm.value;
    const servicioSeleccionado = this.servicios.find(serv => serv.id === servicio);
   
    if(servicioSeleccionado){
      
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

}
