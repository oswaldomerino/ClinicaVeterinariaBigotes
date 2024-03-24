import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ClienteFormularioComponent } from './clientes/cliente-formulario/cliente-formulario.component';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';
import { RegistroClienteMascotaComponentComponent } from './clientes/registro-cliente-mascota-component/registro-cliente-mascota-component.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClinicaVeterinariaBigotes';
}
