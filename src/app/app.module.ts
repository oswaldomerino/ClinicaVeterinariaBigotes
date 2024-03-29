import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';



import { ClientesModule } from './clientes/clientes.module';
import { initializeApp } from 'firebase/app';
import { provideFirebaseApp } from '@angular/fire/app';

import { MascotasModule } from './mascotas/mascotas.module';

import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    
    BrowserAnimationsModule,

    NoopAnimationsModule,
    
    

    FormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
   
    ToastrModule.forRoot({
      positionClass :'toast-top-right'
    }),
    

  ],
  providers: [
    provideClientHydration(),
    
  ],
  bootstrap: [
  ]
})
export class AppModule { }

function provideAnimations(): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
    throw new Error('Function not implemented.');
}
