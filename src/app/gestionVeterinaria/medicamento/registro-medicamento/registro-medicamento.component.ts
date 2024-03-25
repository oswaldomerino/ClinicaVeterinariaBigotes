import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { Subscription } from 'rxjs';

import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ClientesModule } from '../../../clientes/clientes.module';
import { GestionVeterinariaModule } from '../../gestion-veterinaria.module';
import { ServiciosVeterinariosComponent } from '../../serviciosVeterinarios/servicios-veterinarios/servicios-veterinarios.component';
import { SharedDataGestionVeterinariaService } from '../../../servicios/shared-data-gestion-veterinaria.service';


 export interface Medicamento {
  id:string
  codigoBarras: string;
  nombreVacuna: string;
  categoria:string;
  descripcion: string;
  periodicidad: number;
  proximaCita: boolean;
  laboratorio:string;
  precio:number;
  stock:number;
  fechaExpiracion:string;

}


@Component({
  selector: 'app-registro-medicamento',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule,NgbModule,GestionVeterinariaModule ],
  templateUrl: './registro-medicamento.component.html',
  styleUrl: './registro-medicamento.component.css'
})
export class RegistroMedicamentoComponent {
  medicamentoForm!: FormGroup;
  medicamentoId: any;
  medicamentoSeleccionado: any;
  subscription: Subscription | undefined;
  modoEdicion = false;

  constructor(
    private formBuilder: FormBuilder,
    private medicamentoService: GestionVeterinariaService,
    private sharedDataService: SharedDataGestionVeterinariaService
  ) { }

  ngOnInit(): void {

    this.subscription = this.sharedDataService.medicamentoSeleccionado$.subscribe(medicamento => {
      this.medicamentoSeleccionado = medicamento;
      if (this.medicamentoSeleccionado) {
        this.modoEdicion = true;
        this.llenarFormulario();
      }
    });

    this.medicamentoSeleccionado = this.sharedDataService.getMedicamentoSeleccionado();
    this.medicamentoForm = this.formBuilder.group({
      codigoBarras: [''],
      nombreVacuna: ['', Validators.required],
      categoria: ['', Validators.required],
      descripcion: [''],
      periodicidad: ['', Validators.required],
      proximaCita: [false, Validators.required],
      laboratorio: [''],
      precio: [''],
      stock: [''],
      fechaExpiracion: ['']
    });

    const productos: Medicamento[] = [
      {
        id: "1",
        codigoBarras: "123456789",
        nombreVacuna: "Vacuna contra la rabia",
        categoria: "Vacunas",
        descripcion: "Vacuna para prevenir la rabia en mascotas.",
        periodicidad: 365, // Cada año
        proximaCita: true,
        laboratorio: "Pfizer",
        precio: 25.99,
        stock: 100,
        fechaExpiracion: "2023-12-31"
      },
    ]

    productos.forEach(element => {
    //  this.medicamentoService.agregarMedicamento(element)
    });

   
  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  llenarFormulario(): void {
    this.medicamentoForm.patchValue({
      id: this.medicamentoSeleccionado.id,
      codigoBarras: this.medicamentoSeleccionado.codigoBarras,
      nombreVacuna: this.medicamentoSeleccionado.nombreVacuna,
      categoria: this.medicamentoSeleccionado.categoria,
      descripcion: this.medicamentoSeleccionado.descripcion,
      periodicidad: this.medicamentoSeleccionado.periodicidad,
      proximaCita: this.medicamentoSeleccionado.proximaCita,
      laboratorio: this.medicamentoSeleccionado.laboratorio,
      precio: this.medicamentoSeleccionado.precio,
      stock: this.medicamentoSeleccionado.stock,
      fechaExpiracion: this.medicamentoSeleccionado.fechaExpiracion
    });
    this.medicamentoId = this.medicamentoSeleccionado.id;
  }

  guardarMedicamento(): void {
    // Aquí puedes implementar la lógica para guardar el medicamento
    if (this.modoEdicion) {
      // Modo edición: llamar a la función de editar
      this.editarMedicamento();
    } else {
      // Modo nuevo: llamar a la función de guardar
      this.registrarMedicamento();
    }
  }


  registrarMedicamento() {
    if (this.medicamentoForm.invalid) {
      // Mostrar un mensaje de advertencia al usuario
      this.mostrarAdvertencia();
      return;
    }
    
    const medicamento: Medicamento = this.medicamentoForm.value;
    this.medicamentoService.agregarMedicamento(medicamento)
      .then(() => {
        this.mostrarExito('¡Medicamento registrado correctamente!');
        this.medicamentoForm.reset();
      })
      .catch(error => {
        this.mostrarError('Hubo un error al registrar el medicamento.');
      });
  }


  editarMedicamento() {
    if (this.medicamentoForm.invalid) {
      // Mostrar un mensaje de advertencia al usuario
      this.mostrarAdvertencia();
      return;
    }
    
    const medicamento: Medicamento = this.medicamentoForm.value;
    this.medicamentoService.actualizarMedicamento(this.medicamentoId, medicamento)
      .subscribe(() => {
        this.mostrarExito('¡Medicamento actualizado correctamente!');
        this.medicamentoForm.reset();
        this.modoEdicion=false;
        // Lógica adicional si es necesario
      }, error => {
        console.error('Error al editar medicamento en la base de datos:', error);
        this.mostrarError('Hubo un error al actualizar el medicamento.');
      });
  }


// Función para obtener los nombres de los campos faltantes
obtenerCamposFaltantes(): string[] {
  const camposFaltantes: string[] = [];
  Object.keys(this.medicamentoForm.controls).forEach(controlName => {
    const control = this.medicamentoForm.controls[controlName];
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
    Swal.fire('Éxito', mensaje, 'success');
  }

  mostrarError(mensaje: string) {
    Swal.fire('Error', mensaje, 'error');
  }
}