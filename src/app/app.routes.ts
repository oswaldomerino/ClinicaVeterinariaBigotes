import { Routes } from '@angular/router';
import { ClienteFormularioComponent } from './clientes/cliente-formulario/cliente-formulario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroClienteMascotaComponentComponent } from './clientes/registro-cliente-mascota-component/registro-cliente-mascota-component.component';
import { AppComponent } from './app.component';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';

export const routes: Routes = [
    { path: '', component: RegistroClienteMascotaComponentComponent }, // Ruta por defecto para el dashboard
    {path: 'registro', component: RegistroClienteMascotaComponentComponent},
    {path: 'clientes', component: ClientesListaComponent},
];
