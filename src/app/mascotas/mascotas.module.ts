import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule, provideFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ToastrModule } from 'ngx-toastr';
import { environment } from '../../environments/environment';
import { ClientesListaComponent } from '../clientes/clientes-lista/clientes-lista.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MascotaFormularioComponent } from './mascota-formulario/mascota-formulario.component';



@NgModule({
  declarations: [MascotaFormularioComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ToastrModule.forRoot({
      positionClass :'toast-top-right'
    }),
    NgSelectModule
  ], exports:[MascotaFormularioComponent]
})
export class MascotasModule { }
