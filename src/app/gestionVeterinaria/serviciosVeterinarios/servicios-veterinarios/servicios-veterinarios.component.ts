import { Component } from '@angular/core';
import { ServiciosListaComponent } from '../servicios-lista/servicios-lista.component';
import { RegistroServicioComponent } from '../registro-servicio/registro-servicio.component';
import { FirebaseModule } from '../../../firebase/firebase.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-servicios-veterinarios',
  standalone: true,
  imports: [ServiciosListaComponent, RegistroServicioComponent, FirebaseModule],
  providers:[ToastrService],
  templateUrl: './servicios-veterinarios.component.html',
  styleUrl: './servicios-veterinarios.component.css'
})
export class ServiciosVeterinariosComponent {

}
