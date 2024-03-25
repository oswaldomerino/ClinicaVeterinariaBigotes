import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Servicio } from '../../../shared/interfaces/servicios-veterinarios.interface';
import { SharedDataGestionVeterinariaService } from '../../../servicios/shared-data-gestion-veterinaria.service';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';




interface NuevoServicioEstetica {
  nombre: string;
  pelo: string;
  estadoPelo: string;
  precio: number;
  tipoPrecio:string
}

@Component({
  selector: 'app-registro-servicio',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule,ReactiveFormsModule],
  templateUrl: './registro-servicio.component.html',
  styleUrl: './registro-servicio.component.css'
})
export class RegistroServicioComponent {
  servicioForm!: FormGroup;
  form!: FormGroup;

  modoEdicion = false;
  servicioId:any

  servicioSeleccionado: Servicio | null=null;
  subscription: Subscription | undefined;

  tipoPrecioSeleccionado: string = '';

  tallasPorDefecto: string[] = ['XS', 'S', 'M', 'L', 'XL'];
  rangosPesoPorDefecto: {inicio: number, fin: number}[] = [
    { inicio: 0, fin: 5 },
    { inicio: 6, fin: 10 },
    { inicio: 11, fin: 15 },
    { inicio: 16, fin: 20 },
    { inicio: 21, fin: 25 }
  ];

  constructor(private formBuilder: FormBuilder,
    private fb: FormBuilder,
    private _servicio :GestionVeterinariaService,
    private sharedDataService : SharedDataGestionVeterinariaService,
    private toastr: ToastrService) { }

    ngOnInit(): void {
      this.inicializarFormulario();
    
      this.subscription = this.sharedDataService.servicioSeleccionado$.subscribe(servicio => {
        this.servicioSeleccionado = servicio;
        if (this.servicioSeleccionado) {
          this.modoEdicion = true;
          this.llenarFormulario();
        } else {
          // Agregar los precios por defecto solo si no estás en modo edición
          this.agregarPreciosPorDefecto();
        }
      });
    

      

      // Observar cambios en el tipo de precio seleccionado
      this.servicioForm.get('tipoPrecio')?.valueChanges.subscribe(value => {
        this.tipoPrecioSeleccionado = value;
      });
    }

    ngOnDestroy(): void {
      // Asegúrate de cancelar la suscripción cuando el componente se destruya
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
    
    private agregarPreciosPorDefecto(): void {
      const preciosArray = this.servicioForm.get('precios') as FormArray;
    
      for (let i = 0; i < this.tallasPorDefecto.length; i++) {
        preciosArray.push(this.crearPrecioFormGroup(this.tallasPorDefecto[i], this.rangosPesoPorDefecto[i], 0));
      }
    }
    
  
    private limpiarPrecios(): void {
      const preciosArray = this.servicioForm.get('precios') as FormArray;
      while (preciosArray.length !== 0) {
        preciosArray.removeAt(0);
      }
    }
    
  private crearPrecioFormGroup(talla: string, rangoPeso: {inicio: number, fin: number}, precio: number): FormGroup {
    return this.formBuilder.group({
      talla: [talla, Validators.required],
      rangoPesoInicio: [rangoPeso.inicio, Validators.required],
      rangoPesoFin: [rangoPeso.fin, Validators.required],
      precio: [precio, Validators.required]
    });
  }

  inicializarFormulario(): void {
    this.servicioForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      descripcion: [''],
      categoria: [''],
      precios: this.formBuilder.array([], Validators.required),
      costosExtras: this.formBuilder.array([]),
      tipoPrecio: [''],
      precioUnitario: [''], // Para precio unitario
    });

    // Agrega console.log para verificar la inicialización del formulario y sus controles
  //  console.log('Formulario inicializado:', this.servicioForm.value);
  }

  llenarFormulario(): void {
    this.limpiarPrecios();
    if (this.servicioSeleccionado) {
      // Llenar los campos del formulario
      this.servicioForm.patchValue({
        nombre: this.servicioSeleccionado.nombre,
        descripcion: this.servicioSeleccionado.descripcion,
        categoria: this.servicioSeleccionado.categoria,
        tipoPrecio:this.servicioSeleccionado.tipoPrecio,
        precioUnitario:this.servicioSeleccionado.precioUnitario
      });
  
      // Llenar el array de precios
      this.servicioSeleccionado.precios.forEach(precio => {
        this.preciosArray.push(this.formBuilder.group(precio));
      });
  
      // Llenar el array de costos extras
      this.servicioSeleccionado.costosExtras.forEach(costoExtra => {
        this.costosExtrasArray.push(this.formBuilder.group(costoExtra));
      });
  
      this.servicioId = this.servicioSeleccionado.id;
    }
  }
  
  
  

  get preciosArray(): FormArray {
    return this.servicioForm.get('precios') as FormArray;
  }

  get costosExtrasArray(): FormArray {
    return this.servicioForm.get('costosExtras') as FormArray;
  }

  createPrecioControl(): FormGroup {
    return this.formBuilder.group({
      talla: ['', Validators.required],
      peso: ['', Validators.required],
      precio: ['', Validators.required]
    });
  }

  agregarPrecio(): void {
    const nuevoPrecio = this.createPrecioControl();
    this.preciosArray.push(nuevoPrecio);

    // Verificar si el control existe antes de acceder a él
    if (nuevoPrecio.get('talla') && nuevoPrecio.get('peso') && nuevoPrecio.get('precio')) {
   //   console.log('Precio agregado:', this.servicioForm.value);
    } else {
      console.error('Error al agregar precio:', this.servicioForm.value);
    }
  }

  eliminarPrecio(index: number): void {
    this.preciosArray.removeAt(index);

    // Agrega console.log para verificar la eliminación de un precio
   // console.log('Precio eliminado:', this.servicioForm.value);
  }

  createCostoExtraControl(): FormGroup {
    return this.formBuilder.group({
      nombre: ['', Validators.required],
      precio: ['', Validators.required]
    });
  }

  agregarCostoExtra(): void {
    this.costosExtrasArray.push(this.createCostoExtraControl());
    // Agrega console.log para verificar la adición de un nuevo costo extra
  //  console.log('Costo extra agregado:', this.servicioForm.value);
  }

  eliminarCostoExtra(index: number): void {
    this.costosExtrasArray.removeAt(index);
    // Agrega console.log para verificar la eliminación de un costo extra
   // console.log('Costo extra eliminado:', this.servicioForm.value);
  }

 // Método para guardar el servicio en la base de datos
agregarServicio(): void {
  // Aquí puedes implementar la lógica para guardar el servicio
  if (this.modoEdicion) {
    // Modo edición: llamar a la función de editar
    this.editarServicio();
  } else {
    // Modo nuevo: llamar a la función de guardar
    this.registrarServicio();
  }
}

registrarServicio() {
  if (this.servicioForm.invalid) {
    // Mostrar un mensaje de advertencia al usuario
    this.mostrarAdvertencia();
    return;
  }
  const serv: Servicio = this.servicioForm.value;


  // Validar si es precio unitario que al menos el precio unitario esté capturado
  if (serv.tipoPrecio === 'unitario' && !serv.precioUnitario) {
    this.toastr.warning('Por favor, captura el precio unitario.');
    return;
  }

  // Validar si es por tallas que al menos un precio esté capturado
  if (serv.tipoPrecio === 'porPesoYtalla' && serv.precios.every(p => !p.precio)) {
    this.toastr.warning('Por favor, captura al menos un precio por talla.');
    return;
  }
  
  const servicio: Servicio = this.servicioForm.value;
  this._servicio.agregarServicio(servicio)
    .then(() => {
      this.mostrarExito('¡Servicio registrado correctamente!');
      this.servicioForm.reset();
      this.preciosArray.clear();
      this.costosExtrasArray.clear()
    })
    .catch(error => {
      this.mostrarError('Hubo un error al registrar el servicio.');
    });
}

editarServicio() {
  if (this.servicioForm.invalid) {
    // Mostrar un mensaje de advertencia al usuario
    this.mostrarAdvertencia();
    return;
  }
  
  const servicio: Servicio = this.servicioForm.value;
  this._servicio.updateServicio(this.servicioId, servicio)
    .subscribe(() => {
      this.mostrarExito('¡Servicio actualizado correctamente!');
      this.servicioForm.reset();
      this.preciosArray.clear();
      this.costosExtrasArray.clear()
      this.modoEdicion=false;
      // Lógica adicional si es necesario
    }, error => {
      console.error('Error al editar servicio en la base de datos:', error);
      this.mostrarError('Hubo un error al actualizar el servicio.');
    });
}

// Función para obtener los nombres de los campos faltantes
obtenerCamposFaltantes(): string[] {
  const camposFaltantes: string[] = [];
  Object.keys(this.servicioForm.controls).forEach(controlName => {
    const control = this.servicioForm.controls[controlName];
    if (control.invalid) {
      camposFaltantes.push(controlName);
    }
  });
  return camposFaltantes;
}

mostrarAdvertencia() {
  const camposFaltantes = this.obtenerCamposFaltantes();
  if (camposFaltantes.length === 0) {
    return;
  }

  let mensaje = '<ul>';
  camposFaltantes.forEach(nombreCampo => {
    mensaje += `<li>${nombreCampo}</li>`;
  });
  mensaje += '</ul>';

  Swal.fire({
    title: 'Campos Obligatorios Faltantes',
    html: mensaje,
    icon: 'warning'
  });
}

mostrarExito(mensaje: string) {
  this.toastr.success('Éxito', mensaje);
}

mostrarError(mensaje: string) {
  this.toastr.error('Error', mensaje);
}

cancelarEdicion(){
  this.servicioForm.reset();
      this.preciosArray.clear();
      this.costosExtrasArray.clear()
      this.modoEdicion=false;
}

}