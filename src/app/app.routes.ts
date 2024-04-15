
import { ClienteFormularioComponent } from './clientes/cliente-formulario/cliente-formulario.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroClienteMascotaComponentComponent } from './clientes/registro-cliente-mascota-component/registro-cliente-mascota-component.component';
import { AppComponent } from './app.component';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { MascotasListaComponent } from './mascotas/mascotas-lista/mascotas-lista.component';
import { CatalogoMedicamentoComponent } from './gestionVeterinaria/medicamento/catalogo-medicamento/catalogo-medicamento.component';
import { EsteticaComponent } from './departamentos/estetica/estetica.component';
import { Routes } from '@angular/router';
import { TiendaComponent } from './departamentos/tienda/tienda.component';

export const routes: Routes = [
    { path: '', component: RegistroClienteMascotaComponentComponent }, // Ruta por defecto para el dashboard
    {path: 'registro', component: RegistroClienteMascotaComponentComponent},
    {path: 'clientes', component: ClientesListaComponent},
    {path: 'recepcion', component: RecepcionComponent},
    {path: 'mascotas', component: MascotasListaComponent},
    {path: 'catalogoMedicamentos', component: CatalogoMedicamentoComponent},
    {path: 'atencionestetica', component: EsteticaComponent},
    {path: 'inicio', component: TiendaComponent},
];
