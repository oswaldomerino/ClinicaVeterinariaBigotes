import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Empleado } from '../../../shared/interfaces/empleado.interface';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SharedDataGestionVeterinariaService } from '../../../servicios/shared-data-gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FirebaseModule } from '../../../firebase/firebase.module';

@Component({
  selector: 'app-empleados-lista',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule,FirebaseModule],
  templateUrl: './empleados-lista.component.html',
  styleUrl: './empleados-lista.component.css'
})
export class EmpleadosListaComponent {
  empleados: Empleado[] = [];
  filtro: string = '';
  subscription: Subscription = new Subscription;

  constructor( 
    private empleadoService: GestionVeterinariaService,
    private sharedDataService: SharedDataGestionVeterinariaService
  ) { }

  ngOnInit(): void {
    this.obtenerEmpleados();
  }

  obtenerEmpleados(): void {
    this.empleadoService.getAllEmpleados().subscribe(
      empleados => this.empleados = empleados,
      error => console.error('Error al obtener los empleados', error)
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  editarEmpleado(empleado: Empleado): void {
    this.sharedDataService.setEmpleadoSeleccionado(empleado);
  }

  eliminarEmpleado(id: string): void {
    if (confirm('¿Estás seguro de eliminar este empleado?')) {
      this.empleadoService.eliminarEmpleado(id).then(
        () => {
          this.empleados = this.empleados.filter(empleado => empleado.idEmpleado !== id);
          console.log('Empleado eliminado exitosamente');
        },
        error => console.error('Error al eliminar el empleado', error)
      );
    }
  }

  filtrarEmpleados(): any[] {
    if (!this.filtro) {
      return this.empleados;
    }
    return this.empleados.filter(empleado =>
      empleado.nombre.toLowerCase().includes(this.filtro.toLowerCase())
      || empleado.idEmpleado.toLowerCase().includes(this.filtro.toLowerCase())
      || empleado.rol.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}
