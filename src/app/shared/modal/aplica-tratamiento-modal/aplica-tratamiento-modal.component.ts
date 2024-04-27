import { Component } from '@angular/core';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MascotaService } from '../../../servicios/mascota.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { FirebaseModule } from '../../../firebase/firebase.module';
import { Empleado } from '../../interfaces/empleado.interface';
import { CommonModule } from '@angular/common';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import Swal from 'sweetalert2';
import { SharedDataService } from '../../../servicios/shared-data.service';
import { formatDate } from 'date-fns';
import { SalaEsperaService } from '../../../servicios/sala-espera.service';

@Component({
  selector: 'app-aplica-tratamiento-modal',
  standalone: true,
  imports: [ CommonModule,ReactiveFormsModule,FormsModule,NgbModule,NgSelectModule, ],
  providers:[ToastrService],
  templateUrl: './aplica-tratamiento-modal.component.html',
  styleUrl: './aplica-tratamiento-modal.component.css'
})
export class AplicaTratamientoModalComponent {
  cliente!: any
  mascota!: any
  empleados:Empleado[]=[]
  formulario!: FormGroup;
  listaEspera!:any // Variable para almacenar la lista de espera
  opcionesMedicamentosVacunas: { value: string, label: string }[] = [];

  medicamentosVacunas: any[] = [];
  medicamentoSeleccionado: any = null;

  loadingDescripciones = false; // Indicador de carga de descripciones
  descripciones: any[] = [];
  selectDescripciones: any[] = [];


  
  constructor(
    public activeModal: NgbActiveModal,
    private mascotaService: SharedDataService,
    private toastr: ToastrService, // Inyecta ToastrService
    private descripcionService:GestionVeterinariaService,
    private firebase: GestionVeterinariaService,
    private formBuilder: FormBuilder, // Inyecta FormBuilder
    private _listEspetaFB: SalaEsperaService,

  ) { 


  }
  ngOnInit(): void {

    
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

    this.cargarDatosLista()
    this.consultarDescripciones();

            // Suscribirse a los cambios en los campos de fecha de aplicación y periodicidad
            this.formulario.get('fechaAplicacion')?.valueChanges.subscribe(() => {
              this.actualizarProximaCita();
            });
        
            this.formulario.get('periodicidad')?.valueChanges.subscribe(() => {
              this.actualizarProximaCita();
            });
        
            this.formulario.get('medicamentoVacuna')?.valueChanges.subscribe(value => {
              // Obtener el medicamento seleccionado
            //  this.medicamentoSeleccionado = this.medicamentos.find(medicamento => medicamento.id === value);
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

// Método para cargar los datos de la lista seleccionada
cargarDatosLista(): void {
  if (this.listaEspera && this.listaEspera.infoServicio) {
  
    this.medicamentoSeleccionado = this.listaEspera.infoServicio;
    this.mascota = this.listaEspera.mascota;
    this.cliente = this.listaEspera.cliente;
   // console.log('Lista de espera:', this.listaEspera); // Verificar la lista de espera
    this.formulario.patchValue({
      atendidoPor: this.listaEspera.infoServicio.atendidoPor,
      peso: this.listaEspera.infoServicio.peso,
      precioVacuna: this.listaEspera.costoTotal,
      descripciones: this.listaEspera.descripciones,
      medicamentoVacuna: this.listaEspera.infoServicio.medicamento,
      estadoVacuna: 'aplicada',
      periodicidad: this.listaEspera.infoServicio.periodicidad,
      proximaCita: this.listaEspera.infoServicio.proximaCita,
    });
    this.formulario.get('medicamentoVacuna')?.disable();
    this.formulario.get('estadoVacuna')?.disable();
  } else {
    this.toastr.error('¡Error!', 'Mascota o temperamentos de la mascota son undefined o null');
  }
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

  guardarVacuna() {
    if (this.medicamentoSeleccionado) {
      const { atendidoPor, descripciones, servicio , peso, precio, costosExtras } = this.formulario.value;

const datosVacuna = {
  idMedicamento: this.medicamentoSeleccionado.idMedicamento || '',
  descripcion: this.medicamentoSeleccionado.nombreVacuna || '',
  medicamento: this.medicamentoSeleccionado.medicamento || '',
  fechaAplicacion: this.formulario.get('fechaAplicacion')?.value || '',
  periodicidad: this.medicamentoSeleccionado.periodicidad || '',
  proximaCita: this.formulario.get('proximaCita')?.value || '',
  peso: this.formulario.get('peso')?.value || '',
  precioVacuna: this.formulario.get('precioVacuna')?.value || '',
  comentario: descripciones || '',
  estadoVacuna: this.formulario.get('estadoVacuna')?.value || '',
  atendidoPor: this.formulario.get('atendidoPor')?.value || '',
};

      console.log('Datos de la vacuna:', datosVacuna);

    
  const status= this.formulario.get('estadoVacuna')?.value
      if(status=='en_espera'){
       
      }else{


     // Inicializa el arreglo de vacunas si no existe
     this.mascota.vacunas = this.mascota.vacunas || [];
  
     // Añade la vacuna a la lista de vacunas de la mascota
     this.mascota.vacunas.push(datosVacuna);// Busca la vacuna en el arreglo de vacunas
     let vacunaExistente = this.mascota.vacunas.find((vacuna:any) => vacuna.idMedicamento === datosVacuna.idMedicamento);
     
     if (vacunaExistente) {
       // Si la vacuna ya existe, la actualiza
       Object.assign(vacunaExistente, datosVacuna);
     } else {
       // Si la vacuna no existe, la añade a la lista de vacunas de la mascota
       this.mascota.vacunas.push(datosVacuna);
     }


 
     // Actualiza el peso de la mascota
     this.mascota.peso = this.formulario.get('peso')?.value;
 

     console.log('Datos de la mascota:', this.mascota);
     // Guarda los datos en la base de datos
     this.firebase.insertVacunas(this.mascota.id, this.mascota)
       .subscribe(() => {
         Swal.fire('¡Cliente actualizado!', 'El cliente se ha actualizado correctamente.', 'success');
       }, error => {
         console.error('Error al editar mascota en la base de datos:', error);
         Swal.fire('¡Error!', 'Hubo un error al editar la mascota. Por favor, inténtalo de nuevo más tarde.', 'error');
       });
      }

        // Obtener la hora actual
    const horaActual = new Date();
       const hora=horaActual.toISOString()
      this._listEspetaFB.updateListaEspera(this.listaEspera.id, {status: 'atendido',horaAtencion:hora,descripciones:descripciones, })
      .subscribe(() => {
        this.toastr.success('Cliente registrado en lista de espera correctamente.', 'Éxito');
      //  const result={modal:'addListaEspera', valor:listaEsperaItem}
      this.activeModal.close();
      }, error => {
        console.error('Error al editar cliente en la base de datos:', error);
        this.toastr.error('Error al registrar cliente en lista de espera.', 'Error');
      });



 
    }
    console.log('Datos de la vacuna:', this.medicamentoSeleccionado);
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


  closeModal(): void {
    this.activeModal.close();
  }
}
