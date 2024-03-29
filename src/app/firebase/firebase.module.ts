import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreModule, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFirebaseApp } from '@angular/fire/app';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FirestoreModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
  ]
})
export class FirebaseModule { }
