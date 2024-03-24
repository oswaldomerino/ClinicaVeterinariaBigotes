import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ClienteFormularioComponent } from './clientes/cliente-formulario/cliente-formulario.component';
import { ClientesModule } from './clientes/clientes.module';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet,ClientesModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ClinicaVeterinariaBigotes';
}
