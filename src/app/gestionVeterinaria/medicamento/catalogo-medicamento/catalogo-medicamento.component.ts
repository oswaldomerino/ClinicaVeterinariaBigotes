import { Component } from '@angular/core';
import { MedicamentosListaComponent } from '../medicamentos-lista/medicamentos-lista.component';
import { RegistroMedicamentoComponent } from '../registro-medicamento/registro-medicamento.component';
import { ServiciosVeterinariosComponent } from '../../serviciosVeterinarios/servicios-veterinarios/servicios-veterinarios.component';
import { EmpleadosComponent } from '../../empleados/empleados/empleados.component';

@Component({
  selector: 'app-catalogo-medicamento',
  standalone: true,
  imports: [MedicamentosListaComponent, RegistroMedicamentoComponent,ServiciosVeterinariosComponent, EmpleadosComponent],
  templateUrl: './catalogo-medicamento.component.html',
  styleUrl: './catalogo-medicamento.component.css'
})
export class CatalogoMedicamentoComponent {

}
