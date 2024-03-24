import { Routes } from '@angular/router';
import { ClienteFormularioComponent } from './clientes/cliente-formulario/cliente-formulario.component';

export const routes: Routes = [
    {path: '**', component: ClienteFormularioComponent},
];
