import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClienteFormularioComponent } from './cliente-formulario/cliente-formulario.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { ToastrModule, ToastrService } from 'ngx-toastr'; // Importar el servicio ToastrService


@NgModule({
  declarations: [ClienteFormularioComponent],
  
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ToastrModule.forRoot({
      positionClass :'toast-top-right'
    })
  ],
  providers:[ToastrService,],
  exports:[ClienteFormularioComponent]
})
export class ClientesModule { }
