import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideFirebaseApp } from '@angular/fire/app';
import { FirestoreModule, provideFirestore } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { environment } from '../../environments/environment';



@NgModule({
  declarations: [],
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
  ],
  providers:[ToastrService,],
})
export class RecepcionModule { }
