import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FirebaseModule } from '../../../firebase/firebase.module';

@Component({
  selector: 'app-selecionar-aplicacion',
  standalone: true,
  imports: [],
  providers:[ToastrService,FirebaseModule,   { provide: NgbActiveModal, useValue: {} }],
  templateUrl: './selecionar-aplicacion-modal.component.html',
  styleUrl: './selecionar-aplicacion-modal.component.css'
})
export class SelecionarAplicacionModalComponent {

}
