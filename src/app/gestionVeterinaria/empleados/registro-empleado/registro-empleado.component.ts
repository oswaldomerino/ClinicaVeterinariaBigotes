import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SharedDataGestionVeterinariaService } from '../../../servicios/shared-data-gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Empleado } from '../../../shared/interfaces/empleado.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registro-empleado',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule],
  templateUrl: './registro-empleado.component.html',
  styleUrl: './registro-empleado.component.css'
})
export class RegistroEmpleadoComponent {
  empleadoForm!: FormGroup;
  empleadoId: any;
  empleadoSeleccionado: any;
  subscription: Subscription | undefined;
  modoEdicion = false;

  constructor(
    private formBuilder: FormBuilder,
    private empleadoService: GestionVeterinariaService,
    private sharedDataService: SharedDataGestionVeterinariaService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subscription = this.sharedDataService.empleadoSeleccionado$.subscribe(empleado => {
      this.empleadoSeleccionado = empleado;
      if (this.empleadoSeleccionado) {
        this.modoEdicion = true;
        this.llenarFormulario();
      }
    });
    this.empleadoSeleccionado = this.sharedDataService.getEmpleadoSeleccionado();

    this.empleadoForm = this.formBuilder.group({
      idEmpleado: [''],
      nombre: ['', Validators.required],
      direccion: ['', Validators.required],
      telefono: [''],
      email: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      rol: ['']
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  llenarFormulario(): void {
    this.empleadoForm.patchValue({
      id: this.empleadoSeleccionado.id,
      idEmpleado: this.empleadoSeleccionado.idEmpleado,
      nombre: this.empleadoSeleccionado.nombre,
      direccion: this.empleadoSeleccionado.direccion,
      telefono: this.empleadoSeleccionado.telefono,
      email: this.empleadoSeleccionado.email,
      fechaInicio: this.empleadoSeleccionado.fechaInicio,
      rol: this.empleadoSeleccionado.rol
    });
    this.empleadoId = this.empleadoSeleccionado.id;
  }

  guardarEmpleado(): void {
    if (this.modoEdicion) {
      this.editarEmpleado();
    } else {
      this.registrarEmpleado();
    }
  }

  registrarEmpleado() {
    if (this.empleadoForm.invalid) {
      // Mostrar un mensaje de advertencia al usuario
      this.mostrarAdvertencia();
      return;
    }
    
    const empleado: Empleado = this.empleadoForm.value;
    this.empleadoService.agregarEmpleado(empleado)
      .then(() => {
        this.mostrarExito('¡Empleado registrado correctamente!');
        this.empleadoForm.reset();
      })
      .catch(error => {
        this.mostrarError('Hubo un error al registrar el empleado.');
      });
  }

  editarEmpleado() {
    if (this.empleadoForm.invalid) {
      // Mostrar un mensaje de advertencia al usuario
      this.mostrarAdvertencia();
      return;
    }
    
    const empleado: Empleado = this.empleadoForm.value;
    this.empleadoService.actualizarEmpleado(this.empleadoId, empleado)
      .subscribe(() => {
        this.mostrarExito('¡Empleado actualizado correctamente!');
        this.empleadoForm.reset();
        this.modoEdicion=false;
      }, error => {
        console.error('Error al editar medicamento en la base de datos:', error);
        this.mostrarError('Hubo un error al actualizar el empleado.');
      });
  }


  // Función para obtener los nombres de los campos faltantes
obtenerCamposFaltantes(): string[] {
  const camposFaltantes: string[] = [];
  Object.keys(this.empleadoForm.controls).forEach(controlName => {
    const control = this.empleadoForm.controls[controlName];
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
}

  mostrarExito(mensaje: string) {
    this.toastr.success(mensaje);
  }

  mostrarError(mensaje: string) {
    this.toastr.error(mensaje);
  }
}

