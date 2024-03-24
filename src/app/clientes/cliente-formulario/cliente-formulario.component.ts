import { Component } from '@angular/core';
import { ClientesModule } from '../clientes.module';

import { Subscription } from 'rxjs';
import { ClienteService } from '../../servicios/cliente.service';
import { SharedDataService } from '../../servicios/shared-data.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppModule } from '../../app.module';
import { Cliente } from '../../shared/interfaces/cliente.interface';




@Component({
  selector: 'app-cliente-formulario',
  standalone: false,

  providers:[ToastrService ],
  templateUrl: './cliente-formulario.component.html',
  styleUrl: './cliente-formulario.component.css'
})
export class ClienteFormularioComponent {

  clienteForm!: FormGroup; // Declaración de la variable clienteForm como tipo FormGroup
  clienteRegistrado: boolean = false; // Bandera para indicar si el cliente ha sido registrado
  private subscription: Subscription | undefined;
  editarModo: boolean = false;
  clienteAEditar: any;
  clienteActual: any;
  cliente!: Cliente ;
  idClienteEditar: string | null = null;

  constructor(
    private clienteService: ClienteService, // Inyecta el servicio de clientes en el componente
    private formBuilder: FormBuilder, // Inyecta el FormBuilder para construir formularios
    private sharedDataService: SharedDataService,
    private toastService: ToastrService // Inyectar el servicio de toasts
  ) {


  }


  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit(): void {
  // Inicializar el formulario y suscribirse a los cambios
  this.inicializarFormulario();
  this.subscribeToEditChanges();
  this.subscribeToClientChanges();
  this.subscribeToClientIdChanges();
  // Obtener el cliente actual y establecerlo si existe
  const clienteActual = this.sharedDataService.getClienteActual();
  this.setClienteActual(clienteActual);
  }

  onEditarCliente(cliente: any) {
    console.log('llegue')
    if (!this.editarModo) {
      this.editarModo = true;
      this.clienteAEditar = cliente;
      if (!this.clienteForm) {
        //this.inicializarFormulario();
      }
      this.cargarDatosClienteSeleccionado(cliente);

      const botonGuardar = document.getElementById('botonGuardar');
      if (botonGuardar) {
        botonGuardar.innerText = 'Editar Cliente';
      }
    }
  }

  // Método para inicializar el formulario de cliente
  private inicializarFormulario(): void {
    this.clienteForm = this.formBuilder.group({
      codigo: ['', Validators.required],
      nombres: this.formBuilder.array([this.createControl()], Validators.required),
      direcciones: this.formBuilder.array([this.createControl()], Validators.required),
      telefonos: this.formBuilder.array([this.createControl()], Validators.required),
      advertencias: this.formBuilder.array([]),
      bonos: this.formBuilder.array([])
    });
  }
    // Método para suscribirse a cambios en el modo de edición
    private subscribeToEditChanges(): void {
      this.sharedDataService.editarModoObservable.subscribe(editando => this.editarModo = editando);
    }
  
  // Método para suscribirse a cambios en el cliente
  private subscribeToClientChanges(): void {
    this.sharedDataService.clienteActual.subscribe(cliente => this.setClienteActual(cliente));
  }
  
  
    // Método para suscribirse a cambios en el ID del cliente
    private subscribeToClientIdChanges(): void {
      this.sharedDataService.clienteIdObservable.subscribe(id => this.idClienteEditar = id);
    }
  
    // Método para desuscribirse de todos los observables
    private unsubscribeFromObservables(): void {
      this.subscription?.unsubscribe();
    }
  
    // Método para establecer el cliente actual y cargar sus datos en el formulario
    private setClienteActual(cliente: any): void {
      this.clienteActual = cliente;
      if (this.clienteActual) {
        this.editarModo = true;
        this.cargarDatosClienteSeleccionado(cliente);
      }
    }
  
    cancelarEdicionCliente(): void {
      // Aquí puedes realizar cualquier acción necesaria al cancelar la edición del cliente
      // Por ejemplo, ocultar el formulario y volver a la vista de tarjetas
    
      // Ocultar el formulario
      this.sharedDataService.cambiarVistaFormulario(false);
    }


  // Método para cargar los datos del cliente seleccionado en el formulario
  private cargarDatosClienteSeleccionado(cliente: any): void {
    if (cliente) {
      this.clienteForm.patchValue({
        codigo: cliente.codigo,
      });

      const campos = ['nombres', 'direcciones', 'telefonos', 'bonos', 'advertencias'];

      campos.forEach(campo => {
        const formArray = this.clienteForm.get(campo) as FormArray;
        formArray.clear();
        cliente[campo].forEach((valor: string) => {
          formArray.push(this.formBuilder.control(valor));
        });
      });
    } else {
      console.error('El cliente es undefined');
    }
  }

  // Método genérico para obtener el control de un FormArray
  getControl(nombre: string): FormArray {
    return this.clienteForm.get(nombre) as FormArray;
  }

  // Método genérico para crear un nuevo FormControl
  createControl(): FormControl {
    return this.formBuilder.control('');
  }

  // Método genérico para agregar un nuevo elemento al FormArray
  agregarElemento(nombre: string): void {
    this.getControl(nombre).push(this.createControl());
  }

  // Método genérico para eliminar un elemento del FormArray
  eliminarElemento(nombre: string, i: number): void {
    this.getControl(nombre).removeAt(i);
  }


  // Método para mostrar una alerta
// Método para mostrar un toast
mostrarAlerta(titulo: string, mensaje: string, tipo: 'success' | 'error' | 'warning' | 'info'): void {
  switch (tipo) {
    case 'success':
      this.toastService.success(mensaje, titulo);
      break;
    case 'error':
      this.toastService.error(mensaje, titulo);
      break;
    case 'warning':
      this.toastService.warning(mensaje, titulo);
      break;
    case 'info':
      this.toastService.info(mensaje, titulo);
      break;
    default:
      // Por defecto, muestra un toast de información
      this.toastService.info(mensaje, titulo);
      break;
  }
}

  // Método para validar los campos del formulario
  validarCampos(campos: string[]): boolean {
    for (let campo of campos) {
      const formArray = this.clienteForm.get(campo) as FormArray;
      const values = formArray.value.filter((valor: string) => valor.trim() !== '');
      if (values.length === 0) {
        this.mostrarAlerta('¡Error!', `Por favor, ingresa al menos un ${campo}.`, 'error');
        return false;
      }
    }
    return true;
  }

  // Método para guardar el cliente en la base de datos
  guardarCliente(): void {
    if (this.clienteForm.valid) {
      if (!this.validarCampos(['nombres', 'direcciones', 'telefonos'])) {
        return;
      }
      const cliente = this.clienteForm.value;
      cliente.fechaRegistro = new Date().toISOString();

      if (this.editarModo) {
        this.updateCliente(cliente);
      } else {
        this.registrarCliente(cliente);
      }
    } else {
      this.mostrarMensajeDeError();
    }
  }

   // Método para mostrar un mensaje de error si el formulario no es válido
   private mostrarMensajeDeError(): void {
    const controls = this.clienteForm.controls;
    let errorMessage = 'Por favor, completa todos los campos correctamente:';
    Object.keys(controls).forEach(controlName => {
      if (controls[controlName].invalid) {
        errorMessage += `\n- ${controlName}`;
      }
    });
    this.toastService.error('Error',errorMessage);
    this.mostrarAlerta('¡Error!', errorMessage, 'error');
  }

  // Método para registrar un nuevo cliente en la base de datos
  private registrarCliente(cliente: Cliente): void {
    this.clienteService.agregarCliente(cliente)
      .then((doc:Cliente) => {
        this.mostrarAlerta('¡Cliente agregado!', 'El cliente se ha agregado correctamente.', 'success');
        this.cliente.id = doc.id;
        this.sharedDataService.actualizarCliente(cliente);
        this.sharedDataService.cambiarVistaFormulario(false);
        this.editarModo = false;
      })
      .catch(error => {
        console.error('Error al agregar cliente a la base de datos:', error);
        this.mostrarAlerta('¡Error!', 'Hubo un error al agregar el cliente. Por favor, inténtalo de nuevo más tarde.', 'error');
      });
  }

  // Método para actualizar un cliente en la base de datos
  private updateCliente(cliente: any): void {
    this.clienteService.updateCliente(this.idClienteEditar!, cliente)
      .subscribe(() => {
        this.mostrarAlerta('¡Cliente actualizado!', 'El cliente se ha actualizado correctamente.', 'success');
        const clienteEd: any = cliente;
        clienteEd.id = this.idClienteEditar;
        this.sharedDataService.actualizarCliente(clienteEd);
        this.sharedDataService.cambiarVistaFormulario(false);
      }, error => {
        console.error('Error al editar cliente en la base de datos:', error);
        this.mostrarAlerta('¡Error!', 'Hubo un error al editar el cliente. Por favor, inténtalo de nuevo más tarde.', 'error');
      });
  }


  // Método para guardar el cliente en la base de datos
  guardarCliente1(): void {
    if (this.clienteForm.valid) {
      const nombres = this.clienteForm.get('nombres') as FormArray;
      const direcciones = this.clienteForm.get('direcciones') as FormArray;

      // Validación adicional para verificar que al menos haya un nombre ingresado
      const nombresValues = nombres.value.filter((nombre: string) => nombre.trim() !== '');
      if (nombresValues.length === 0) {
        // Si no hay nombres ingresados, muestra un mensaje de error
        this.toastService.error('Error','Por favor, ingresa al menos un nombre de cliente.');
        return; // Detiene la ejecución del método
      }

      // Validación adicional para verificar que al menos haya una dirección ingresada
      const direccionesValues = direcciones.value.filter((direccion: string) => direccion.trim() !== '');
      if (direccionesValues.length === 0) {
        // Si no hay direcciones ingresadas, muestra un mensaje de error
        this.toastService.error('Error','Por favor, ingresa al menos una dirección.');
        return; // Detiene la ejecución del método
      }

      const telefonos = this.clienteForm.get('telefonos') as FormArray;
      // Validación adicional para verificar que al menos haya un teléfono ingresado
      const telefonosValues = telefonos.value.filter((telefono: string) => telefono.trim() !== '');
      if (telefonosValues.length === 0) {
        // Si no hay teléfonos ingresados, muestra un mensaje de error
        this.toastService.error('Error','Por favor, ingresa al menos un número de teléfono.');
        return; // Detiene la ejecución del método
      }

      const cliente = this.clienteForm.value;

      // Asignar la fecha de registro actual
      cliente.fechaRegistro = new Date().toISOString(); // Puedes ajustar el formato de la fecha según lo necesites

      // Verificar si el cliente está en modo de edición
      if (this.editarModo) {
        // Cliente en modo de edición, realizar la actualización en la base de datos
        this.clienteService.updateCliente(this.clienteAEditar.id, cliente)
          .subscribe(() => {
            this.toastService.success('Cliente actualizado', 'El cliente se ha actualizado correctamente');
            // Lógica adicional si es necesario
          }, error => {
            console.error('Error al editar mascota en la base de datos:', error);
            this.toastService.error('Error','Hubo un error al editar la mascota. Por favor, inténtalo de nuevo más tarde.');
          });

      } else {
        // Cliente no está en modo de edición, agregar un nuevo cliente en la base de datos
        this.clienteService.agregarCliente(cliente)
          .then((doc) => {
            this.toastService.success('Cliente agregado', 'El cliente se ha agregado correctamente');
          //  this.sharedDataService.setIdCliente(doc.id); // Pasar el ID del cliente
         
         //   this.sharedDataService.setCodigoCliente(cliente.codigo); // Pasar el código del cliente
            this.clienteRegistrado = true; // Actualizar la bandera
            this.clienteForm.disable(); // Deshabilitar el formulario
          })
          .catch(error => {
            console.error('Error al agregar cliente a la base de datos:', error);
            this.toastService.error('Error','Hubo un error al agregar el cliente. Por favor, inténtalo de nuevo más tarde.');
          });
      }
    } else {
      // Mostrar un mensaje de error si el formulario no es válido
      const controls = this.clienteForm.controls;
      let errorMessage = 'Por favor, completa todos los campos correctamente:';
      Object.keys(controls).forEach(controlName => {
        if (controls[controlName].invalid) {
          errorMessage += `\n- ${controlName}`;
        }
      });
      this.toastService.error('Error',errorMessage);
    }
  }


  formatoTelefono(telefonoControl: AbstractControl): void {
    let telefono = telefonoControl.value;
  
    // Eliminar cualquier carácter que no sea un dígito
    telefono = telefono.replace(/\D/g, '');
  
    // Aplicar el formato "877 123 23 23"
    telefono = telefono.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  
    // Asignar el valor formateado al control
    telefonoControl.setValue(telefono);
  }
  





}