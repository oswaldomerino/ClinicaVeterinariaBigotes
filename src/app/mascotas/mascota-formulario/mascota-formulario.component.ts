import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SharedDataService } from '../../servicios/shared-data.service';

import { CommonModule, formatDate } from '@angular/common';
import { MascotaService } from '../../servicios/mascota.service';
import { MascotasModule } from '../mascotas.module';
import { NgSelectModule } from '@ng-select/ng-select';


interface PesoRegistro {
  peso: number;
  fecha: Date;
}

@Component({
  selector: 'app-mascota-formulario',
  standalone: true,
  imports: [MascotasModule, CommonModule,
    FormsModule,
    ReactiveFormsModule,NgSelectModule],
  templateUrl: './mascota-formulario.component.html',
  styleUrl: './mascota-formulario.component.css'
})
export class MascotaFormularioComponent {
  mostrarFormularioMascota: boolean = false;
  mascotaForm!: FormGroup;
  idCliente: string | null = null;
  editarModo: boolean = false;
  mascotaAEditar: any;
  subscription: Subscription = new Subscription();
  especies: any[] = [];
  razas: any[] = [];
  colores: any[] = [];
  temperamentos: any[] = [];
  loading: boolean = false;
  loadingEspecie: boolean = false;
  loadingColor: boolean = false;
  loadingTemperamento: boolean = false;
  selectedTemperamentos: string[] = [];
  edadMascota:string | null=null;

  codigoCliente: string | undefined;

  especieControl = new FormControl();

  
  historialPesos: PesoRegistro[] = []; // Declara una lista para almacenar el historial de pesos



 // opcionesFiltradasEspecie: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    //serv base de datos
    private mascotaService: MascotaService,
    //servi paso de datos entre componentes
    private mascotaS: SharedDataService
  ) {this.initForm() }

  /*

  constructor(
    private formBuilder: FormBuilder,
    private sharedDataService: SharedDataClienteMascotaService,
    private mascotaService: MascotasService,
    private mascotaService: MascotasService,
    private mascotaS: SharedDataService,) {

    
   
    this.mascotaS.mostrarFormularioMascotaObservable.subscribe(mostrar => this.mostrarFormularioMascota = mostrar);
    this.mascotaS.editarModoMascotaObservable.subscribe((mascota) => {
      this.onEditarMascota(mascota);
    });
  
    this.mascotaService = mascotaService; // Inicializa mascotaService correctamente

    this.subscription = this.sharedDataService.editarMascota$.subscribe(mascota => {
      this.onEditarMascota(mascota);
    });
    this.opcionesFiltradasEspecie = this.especieControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filtrarOpciones(value, this.especies))
    );
   
  }
*/
  filtrarOpciones(value: string, opciones: string[]): string[] {
    console.log('Valor de entrada:', value);
    const filtro = value.toLowerCase();
    const opcionesFiltradas = opciones.filter(opcion => opcion.toLowerCase().includes(filtro));
    console.log('Opciones filtradas:', opcionesFiltradas);
    return opcionesFiltradas;
  }

  ngOnInit(): void {
    this.mascotaS.mostrarFormularioMascotaObservable.subscribe(mostrar => this.mostrarFormularioMascota = mostrar);
    this.mascotaS.editarModoMascotaObservable.subscribe(mascota => this.onEditarMascota(mascota));
    this.mascotaS.mascotaSeleccionadoObservable.subscribe(mascota => {
      if (mascota) {
        this.onEditarMascota(mascota);
      }
    });
   // this.initForm();
    this.consultarRazas();
    this.consultarEspecies();
    this.consultarColores();
    this.consultarTemperamentos();
    this.mascotaS.clienteIdObservable.subscribe(clienteId => this.idCliente = clienteId);
  }
  /*
  ngOnInit(): void {
   // this.temperamentos$ = this.mascotaService.getAllTemperamentos();
    this.initForm();
    this.consultarRazas();
    this.consultarEspecies();
    this.consultarColores();
    this.consultarTemperamentos();
    const Cliente = this.sharedDataService.getCliente();
    this.mascotaS.clienteIdObservable.subscribe(cliente => this.idCliente = cliente);
    console.log('cliente existe',Cliente)
    if (Cliente) {
      console.log('cliente existe')
      const idCliente = this.sharedDataService.getIdCliente();
     // const codigoCliente = this.sharedDataService.getCodigoCliente();
      const mascota = this.mascotaForm.value;
      mascota.idCliente = idCliente;
      //mascota.codigoCliente = codigoCliente;
    } else {

    }



  }

*/


/*
ngOnDestroy(): void {
  if (this.fechaNacimientoSubscription) {
    this.fechaNacimientoSubscription.unsubscribe();
  }
}
*/

initForm(): void {
  const fechaActual = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
  this.mascotaForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    especie: ['', Validators.required],
    raza: ['', Validators.required],
    color: [''],
    fechaNacimiento: [fechaActual, Validators.required],
    placa: [''],
    observaciones: [''],
    sexo: ['Macho'],
    anios: [''],
    meses: [''],
    dias: [''],
    temperamentos: [['']],
    peso: ['', Validators.required],
  });
  this.mascotaForm.get('fechaNacimiento')?.valueChanges.subscribe(() => this.calcularEdadMascota());
}

/*
initForm(): void {
  const fechaActual = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');

  this.mascotaForm = this.formBuilder.group({
    nombre: ['', Validators.required],
    especie: ['', Validators.required],
    raza: ['', Validators.required],
    color: [''],
    fechaNacimiento: [fechaActual, Validators.required],
    placa: [''],
    observaciones: [''],
    sexo: ['Macho'],
    anios: [''],
    meses: [''],
    dias: [''],
    temperamentos: [[]], // Nuevo campo para el arreglo de temperamentos
  });

  // Sincronizar la edad aproximada con la fecha de nacimiento
  this.mascotaForm.get('anios')?.valueChanges.subscribe(() => {
  //this.calcularFechaNacimiento();
  });

  this.mascotaForm.get('meses')?.valueChanges.subscribe(() => {
  //  this.calcularFechaNacimiento();
  });

  this.mascotaForm.get('dias')?.valueChanges.subscribe(() => {
   // this.calcularFechaNacimiento();
  });


  // Sincronizar la fecha de nacimiento con la edad aproximada
  this.fechaNacimientoSubscription = this.mascotaForm.get('fechaNacimiento')?.valueChanges.subscribe(() => {
    this.calcularEdadDesdeFechaNacimiento();
  });


}
*/

onEditarMascota(mascota: any): void {
  if (mascota) {
    this.editarModo = true;
    this.mascotaAEditar = mascota;
    this.cargarDatosMascotaSeleccionada(mascota);
    console.error('pero si exite');

  } else {
    console.error('Mascota es undefined o null en onedo');
  }
}

cancelarEdicion(): void {
  // Aquí puedes realizar cualquier acción necesaria al cancelar la edición
  // Por ejemplo, ocultar el formulario y volver a la vista de tarjetas

  // Ocultar el formulario
  this.mascotaS.cambiarVistaFormularioMascota(false);
}


/*

onEditarMascota(mascota: any) {
  this.editarModo = true;
  this.mascotaAEditar = mascota;
  // Lógica para cargar los datos de la mascota en el formulario
  this.cargarDatosMascotaSeleccionada(mascota)
  // Cambiar el texto del botón de guardar a editar
  const botonGuardar = document.getElementById('botonGuardar');
  if (botonGuardar) {
    botonGuardar.innerText = 'Editar Mascota';
  }
}
*/

cargarDatosMascotaSeleccionada(mascota: any): void {
  if (mascota) {
    this.mascotaForm.patchValue({
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      color: mascota.color,
      fechaNacimiento: mascota.fechaNacimiento,
      placa: mascota.placa,
      observaciones: mascota.observaciones,
      sexo: mascota.sexo,
      temperamentos: mascota.temperamentos, // Asegúrate de que cada temperamento tiene una propiedad id
      peso:mascota.peso
    });

    
  } else {
    console.error('Mascota es undefined o null -1');
  }
}



consultarColores(): void {
  this.mascotaService.getAllColores().subscribe((colores: any[]) => {
    if (Array.isArray(colores)) {
      this.colores = colores.map((color: any) => ({ id: color.nombre, name: color.nombre }));
    } else {
      console.error('El valor de "colores" no es un array:', colores);
    }
  });
}

/*
  consultarColores(): void {
    // Consultar los colores desde tu servicio
    this.mascotaService.getAllColores().subscribe(colores => {
        // Verificar si colores es un array
        if (Array.isArray(colores)) {
            // Mapear los colores obtenidos para asignarles un ID único
            this.colores = colores.map((color: any, index: number) => ({ id: color.nombre, name: color.nombre }));
        } else {
            console.error('El valor de "colores" no es un array:', colores);
        }
    });
}
*/

consultarRazas(): void {
  this.mascotaService.getAllRazas().subscribe((razas: any[]) => {
    if (Array.isArray(razas)) {
      this.razas = razas.map((raza: any) => ({ id: raza.nombre, name: raza.nombre })).sort((a, b) => a.name.length - b.name.length);
    } else {
      console.error('El valor de "razas" no es un array:', razas);
    }
  });
}

/*
consultarRazas(): void {
    // Consultar las razas desde Firebase
    this.mascotaService.getAllRazas().subscribe(razas => {
        // Verificar si razas es un array
        if (Array.isArray(razas)) {
            // Mapear las razas obtenidas para asignarles un ID único y ordenarlas por longitud de caracteres
            this.razas = razas
                .map((raza: any) => ({ id: raza.nombre, name: raza.nombre }))
                .sort((a, b) => a.name.length - b.name.length);
        } else {
            console.error('El valor de "razas" no es un array:', razas);
        }
    });
}

*/

consultarEspecies(): void {
  this.mascotaService.getAllEspecies().subscribe((especies: any[]) => {
    if (Array.isArray(especies)) {
      this.especies = especies.map((especie: any) => ({ id: especie.nombre, name: especie.nombre }));
    } else {
      console.error('El valor de "especies" no es un array:', especies);
    }
  });
}
/*
consultarEspecies(): void {
  // Consultar las especies desde Firebase
  this.mascotaService.getAllEspecies().subscribe(especies => {
      // Verificar si especies es un array
      if (Array.isArray(especies)) {
          // Mapear las especies obtenidas para asignarles un ID único
          this.especies = especies.map((especie: any, index: number) => ({ id: especie.nombre, name: especie.nombre }));
          console.log(this.especies)
      } else {
          console.error('El valor de "especies" no es un array:', especies);
      }
  });
}
*/

consultarTemperamentos(): void {
  this.mascotaService.getAllTemperamentos().subscribe((temperamentos: any[]) => {
    if (Array.isArray(temperamentos)) {
      this.temperamentos = temperamentos.map((temperamento: any) => ({ id: temperamento.nombre, name: temperamento.nombre }));
    } else {
      console.error('El valor de "temperamentos" no es un array:', temperamentos);
    }
  });
}

/*
consultarTemperamentos(): void {
  // Consultar los temperamentos desde Firebase
  this.mascotaService.getAllTemperamentos().subscribe(temperamentos => {
      // Verificar si temperamentos es un array
      if (Array.isArray(temperamentos)) {
          // Mapear los temperamentos obtenidos para asignarles un ID único
          this.temperamentos = temperamentos.map((temperamento: any, index: number) => ({ id: temperamento.nombre, name: temperamento.nombre }));
          console.log(this.temperamentos);
      } else {
          console.error('El valor de "temperamentos" no es un array:', temperamentos);
      }
  });
}

*/


ngOnDestroy(): void {
  // Asegúrate de cancelar la suscripción cuando el componente se destruya
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}

/*
calcularEdadDesdeFechaNacimiento(): void {
  const fechaNacimiento = new Date(this.mascotaForm.get('fechaNacimiento')?.value);
  const hoy = new Date();
  const years = differenceInYears(hoy, fechaNacimiento);
  const meses = differenceInMonths(hoy, addDays(fechaNacimiento, years * 365));
  const dias = differenceInDays(hoy, addDays(fechaNacimiento, (years * 365) + (meses * 30)));
  this.mascotaForm.patchValue({
    anios: years.toString(),
    meses: meses.toString(),
    dias: dias.toString()
  });
}
*/
calcularEdadMascota() {
  const fechaNacimiento = new Date(this.mascotaForm.get('fechaNacimiento')?.value);
  let fechaNacimientoDate = new Date(fechaNacimiento);
  let hoy = new Date();
  let diff = hoy.getTime() - fechaNacimientoDate.getTime();
  let edad = new Date(diff);

  let años = edad.getFullYear() - 1970;
  let meses = edad.getMonth();
  let días = edad.getDate();

  let edadMascota = '';
  if (años > 0) {
    edadMascota += `${años} años`;
  }
  if (meses > 0) {
    edadMascota += `${edadMascota ? ', ' : ''}${meses} meses`;
  }
  if (días > 0) {
    edadMascota += `${edadMascota ? ' y ' : ''}${días} días`;
  }

  this.edadMascota = edadMascota || 'Recién nacido';
}

/*
calcularEdadDesdeFechaNacimiento(): void {
  // Desuscribirse temporalmente para evitar bucles infinitos
  if (this.fechaNacimientoSubscription) {
    this.fechaNacimientoSubscription.unsubscribe();
  }

  const fechaNacimiento = new Date(this.mascotaForm.get('fechaNacimiento')?.value);
  const hoy = new Date();

  const years = differenceInYears(hoy, fechaNacimiento);
  const meses = differenceInMonths(hoy, addDays(fechaNacimiento, years * 365));
  const dias = differenceInDays(hoy, addMonths(addDays(fechaNacimiento, years * 365), meses));

  this.mascotaForm.patchValue({
    anios: years.toString(),
    meses: meses.toString(),
    dias: dias.toString()
  });

  // Volver a suscribirse después de la actualización
  this.fechaNacimientoSubscription = this.mascotaForm.get('fechaNacimiento')?.valueChanges.subscribe(() => {
    this.calcularEdadDesdeFechaNacimiento();
  });
}

*/

addTagColorPromise = (name: string) => {
  return new Promise((resolveColors) => {
    this.loadingColor = true;
    // Simular una llamada a la base de datos para agregar el nuevo color
    setTimeout(() => {
      // Crear el objeto del color con el nombre proporcionado
      const color = { nombre: name }; // Objeto con la estructura adecuada
      console.log('Color a agregar:', color); // Verificar el color que se va a agregar
      // Agregar el nuevo color a Firebase utilizando el servicio
      console.log('Antes de agregar el color a Firebase');
      this.mascotaService.addColor(color)
        .then((doc: any) => {
          console.log('Color agregado a Firebase:', doc); // Verificar la respuesta de Firebase
          Swal.fire('Color agregado!', 'El color se ha agregado correctamente.', 'success');
          // Resuelve la promesa con un objeto que contiene el ID del nuevo color y su nombre
          resolveColors({ id: name, name: name, valid: true });
          this.loadingColor = false;
        })
        .catch((error: any) => {
          console.error('Error al agregar color a la base de datos:', error);
          Swal.fire('¡Error!', 'Hubo un error al agregar el color. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
    }, 1000);
  });
};

addTagTemperamentoPromise = (name: string) => {
  return new Promise((resolveTemperamentos) => {
    this.loadingTemperamento = true;
    // Simular una llamada a la base de datos para agregar el nuevo temperamento
    setTimeout(() => {
      // Crear el objeto del temperamento con el nombre proporcionado
      const temperamento = { nombre: name }; // Objeto con la estructura adecuada
      console.log('Temperamento a agregar:', temperamento); // Verificar el temperamento que se va a agregar
      // Agregar el nuevo temperamento a Firebase utilizando el servicio
      console.log('Antes de agregar el temperamento a Firebase');
      this.mascotaService.addTemperamento(temperamento)
        .then((doc: any) => {
          console.log('Temperamento agregado a Firebase:', doc); // Verificar la respuesta de Firebase
          Swal.fire('Temperamento agregado!', 'El temperamento se ha agregado correctamente.', 'success');
          // Resuelve la promesa con un objeto que contiene el ID del nuevo temperamento y su nombre
          resolveTemperamentos({ id: name, name: name, valid: true });
          this.loadingTemperamento = false;
        })
        .catch((error: any) => {
          console.error('Error al agregar temperamento a la base de datos:', error);
          Swal.fire('¡Error!', 'Hubo un error al agregar el temperamento. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
    }, 1000);
  });
};


addTagEspeciePromise = (name: string) => {
  return new Promise((resolveEspecies) => {
    this.loadingEspecie = true;
    // Simular una llamada a la base de datos para agregar la nueva especie
    setTimeout(() => {
      // Crear el objeto de la especie con el nombre proporcionado
      const especie = { nombre: name }; // Objeto con la estructura adecuada
      console.log('Especie a agregar:', especie); // Verifica la especie que se va a agregar
      // Agregar la nueva especie a Firebase utilizando el servicio
      console.log('Antes de agregar la especie a Firebase');
      this.mascotaService.addEspecie(especie)
        .then((doc: any) => {
          console.log('Especie agregada a Firebase:', doc); // Verifica la respuesta de Firebase
          Swal.fire('Especie agregada!', 'La especie se ha agregado correctamente.', 'success');
          // Resuelve la promesa con un objeto que contiene el ID de la nueva especie y su nombre
          resolveEspecies({ id: name, name: name, valid: true });
          this.loadingEspecie = false;
        })
        .catch((error: any) => {
          console.error('Error al agregar especie a la base de datos:', error);
          Swal.fire('¡Error!', 'Hubo un error al agregar la especie. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
    }, 1000);
  });
};



  addTagPromise = (name:string) => {
    return new Promise((resolve) => {
      
      this.loading = true;
      // Simular una llamada a la base de datos para agregar la nueva raza
      setTimeout(() => {
        // Crear el objeto de la raza con el nombre proporcionado
        const raza = { nombre: name }; // Objeto con la estructura adecuada
        console.log('Raza a agregar:', raza); // Agrega este console.log para verificar la raza que se va a agregar
        // Agregar la nueva raza a Firebase utilizando el servicio
        console.log('Antes de agregar la raza a Firebase');
        this.mascotaService.addraza(raza)
        .then((doc: any) => {
          console.log('Raza agregada a Firebase:', doc); // Agrega este console.log para verificar la respuesta de Firebase
          Swal.fire('Raza agregada!', 'la raza se ha agregado correctamente.', 'success');
          // Resuelve la promesa con un objeto que contiene el ID de la nueva raza y su nombre
          resolve({ id: name, name: name, valid: true });
          this.loading = false;
        })
        .catch((error: any) => {
          console.error('Error al agregar cliente a la base de datos:', error);
          Swal.fire('¡Error!', 'Hubo un error al agregar el cliente. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
      }, 1000);
    });
  };



  










  calcularFechaNacimiento(): void {
    const anios = parseInt(this.mascotaForm.get('anios')?.value) || 0;
    const meses = parseInt(this.mascotaForm.get('meses')?.value) || 0;
    const dias = parseInt(this.mascotaForm.get('dias')?.value) || 0;

    const totalDias = anios * 365 + meses * 30 + dias;
    const fechaActual = new Date();
    const fechaNacimiento = new Date(fechaActual.getTime() - totalDias * 24 * 60 * 60 * 1000);
    const formattedDate = fechaNacimiento.toISOString().split('T')[0];

    this.mascotaForm.patchValue({ fechaNacimiento: formattedDate });
  }



  agregarNuevoPeso(peso: number): void {
    const nuevoRegistro: PesoRegistro = {
      peso: peso,
      fecha: new Date() // La fecha actual
    };
    this.historialPesos.push(nuevoRegistro);
  }

  actualizarPeso(indice: number, nuevoPeso: number): void {
    if (indice >= 0 && indice < this.historialPesos.length) {
      this.historialPesos[indice].peso = nuevoPeso;
      this.historialPesos[indice].fecha = new Date(); // Actualizar la fecha también si es necesario
    }
  }



  guardarMascota(): void {
    if (this.editarModo) {
      // Lógica para editar la mascota en la base de datos
      if (this.mascotaForm.valid) {
        const mascota = this.mascotaForm.value;


      //  mascota.temperamentos=(this.selectedTemperamentos);
       // console.log('temperamentosSeleccionados',this.selectedTemperamentos)
        
           // Actualizar el historial de pesos en la mascota
           this.historialPesos = this.mascotaAEditar.historialPesos
           if (!this.historialPesos) {
            this.historialPesos = [];
          }
           this.agregarNuevoPeso(mascota.peso)
          mascota.historialPesos = this.historialPesos;


        // Lógica para editar la mascota en la base de datos
        this.mascotaService.updateMascota(this.mascotaAEditar.id, mascota).subscribe(() => {
          Swal.fire('¡Mascota editada!', 'La mascota se ha editado correctamente.', 'success');
          //this.sharedDataService.ejecutar();
          this.mascotaS.cambiarVistaFormularioMascota(false); // Mostrar el formulario
          this.mascotaForm.reset();
          this.editarModo = false;
          const botonGuardar = document.getElementById('botonGuardar');
          if (botonGuardar) {
            botonGuardar.innerText = 'Guardar Mascota';
          }

          // Puedes agregar aquí más lógica después de editar la mascota
        }, (error: any) => {
          console.error('Error al editar mascota en la base de datos:', error);
          Swal.fire('¡Error!', 'Hubo un error al editar la mascota. Por favor, inténtalo de nuevo más tarde.', 'error');
        });
      } else {
        const controls = this.mascotaForm.controls;
        let errorMessage = 'Por favor, completa todos los campos correctamente:';
        Object.keys(controls).forEach(controlName => {
          if (controls[controlName].invalid) {
            errorMessage += `\n- ${controlName}`;
          }
        });
        Swal.fire('¡Error!', errorMessage, 'error');
      }
    } else {
      // Lógica para agregar una nueva mascota en la base de datos
      if (this.mascotaForm.valid) {
        const mascota = this.mascotaForm.value;
        this.agregarNuevoPeso(mascota.peso)
        // Actualizar el historial de pesos en la mascota
        mascota.historialPesos = this.historialPesos;
    
        if (this.mascotaForm && this.mascotaForm.get('raza')) {
          const valorRaza = this.mascotaForm.get('raza')!.value;
          
          mascota.raza = valorRaza;
          // Haz algo con valorRaza aquí
        } else {
          console.error('mascotaForm o el control de raza no están definidos');
        }

     

        // Obtener el ID y el código del cliente desde el servicio compartido
        const idCliente = this.idCliente;
       // const codigoCliente = this.sharedDataService.getCodigoCliente();
        console.log('este es el idCliente' ,idCliente)
        // Validar que se haya seleccionado un cliente
        if (!idCliente ) {
          Swal.fire('¡Error!', 'Debe seleccionar un cliente antes de registrar una mascota.', 'error');
          return;
        }

        // Agregar el ID y el código del cliente a los datos de la mascota
        mascota.idCliente = idCliente;
        //mascota.codigoCliente = codigoCliente;

        // Asignar la fecha de registro actual
        mascota.fechaRegistro = new Date().toISOString(); // Puedes ajustar el formato de la fecha según lo necesites

        this.mascotaService.agregarMascota(mascota)
          .then(() => {
            Swal.fire('¡Mascota registrada!', 'La mascota se ha registrado correctamente.', 'success');
            // Limpiar el formulario después de registrar la mascota
           // this.sharedDataService.ejecutar();
            console.log('llegue al registro de la mascota sii')
            this.mascotaForm.reset();
            this.mascotaS.cambiarVistaFormularioMascota(false); // Mostrar el formulario
          })
          .catch((error: any) => {
            console.error('Error al agregar mascota a la base de datos:', error);
            Swal.fire('¡Error!', 'Hubo un error al registrar la mascota. Por favor, inténtalo de nuevo más tarde.', 'error');
          });
      } else {
        const controls = this.mascotaForm.controls;
        let errorMessage = 'Por favor, completa todos los campos correctamente:';
        Object.keys(controls).forEach(controlName => {
          if (controls[controlName].invalid) {
            errorMessage += `\n- ${controlName}`;
          }
        });
        Swal.fire('¡Error!', errorMessage, 'error');
      }
    }

  }



}
