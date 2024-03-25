import { Component } from '@angular/core';
import { ServiciosListaComponent } from '../servicios-lista/servicios-lista.component';
import { RegistroServicioComponent } from '../registro-servicio/registro-servicio.component';

@Component({
  selector: 'app-servicios-veterinarios',
  standalone: true,
  imports: [ServiciosListaComponent, RegistroServicioComponent],
  templateUrl: './servicios-veterinarios.component.html',
  styleUrl: './servicios-veterinarios.component.css'
})
export class ServiciosVeterinariosComponent {

}
