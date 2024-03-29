import { Component } from '@angular/core';
import { EmpleadosListaComponent } from '../empleados-lista/empleados-lista.component';
import { RegistroEmpleadoComponent } from '../registro-empleado/registro-empleado.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [EmpleadosListaComponent, RegistroEmpleadoComponent],
  providers:[ToastrService],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})
export class EmpleadosComponent {

}
