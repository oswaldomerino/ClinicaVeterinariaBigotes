
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
import { ConsultasComponent } from './departamentos/consultas/consultas.component';
import { InfoClienteMascotaComponent } from './clientes/info-cliente-mascota/info-cliente-mascota.component';
import { CanDeactivateGuard } from './servicios/can-deactivate-guard.service';
import { EstadisticasVeterinariaComponent } from './dashboard/estadisticas-veterinaria/estadisticas-veterinaria.component';

export const routes: Routes = [
    { path: '', component: EstadisticasVeterinariaComponent }, // Ruta por defecto para el dashboard
    {path: 'registro', component: RegistroClienteMascotaComponentComponent},
    {path: 'clientes', component: ClientesListaComponent},
    {path: 'recepcion', component: RecepcionComponent},
    {path: 'mascotas', component: MascotasListaComponent},
    {path: 'catalogoMedicamentos', component: CatalogoMedicamentoComponent},
    {path: 'atencionestetica', component: EsteticaComponent},
    {path: 'inicio', component: InfoClienteMascotaComponent},
    {path: 'consultas', component: ConsultasComponent},
    {path: 'venta-mostrador', component: TiendaComponent, canDeactivate: [CanDeactivateGuard]},
    { path: 'estadisticas', component: EstadisticasVeterinariaComponent }, // Ruta por defecto para el dashboard
    { path: '**', redirectTo: '/estadisticas'  }, // Ruta por defecto para el dashboard
];
