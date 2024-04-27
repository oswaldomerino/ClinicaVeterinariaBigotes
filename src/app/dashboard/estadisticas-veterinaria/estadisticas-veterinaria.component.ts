import { ChangeDetectorRef, Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from '../../servicios/cliente.service';
import { GestionVeterinariaService } from '../../servicios/gestion-veterinaria.service';
import { MascotaService } from '../../servicios/mascota.service';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { SharedDataGestionVeterinariaService } from '../../servicios/shared-data-gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { FirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { CanDeactivateGuard } from '../../servicios/can-deactivate-guard.service';
import { CobrarModalComponent } from '../../shared/modal/cobrar-modal/cobrar-modal.component';

@Component({
  selector: 'app-estadisticas-veterinaria',
  standalone: true,
  imports: [NgSelectModule,
    CommonModule,
FormsModule,
ReactiveFormsModule,
FirestoreModule,CobrarModalComponent],
providers: [CanDeactivateGuard,ToastrService],
  templateUrl: './estadisticas-veterinaria.component.html',
  styleUrl: './estadisticas-veterinaria.component.css'
})
export class EstadisticasVeterinariaComponent {
  servicios: any[] = [];
  ventas: any[] = [];

  cantidadBanios: number = 0;
  ingresosBanios: number = 0;
  cantidadEsteticas: number = 0;
  ingresosEsteticas: number = 0;
  cantidadConsultas: number = 0;
  ingresosConsultas: number = 0;
  cantidadAplicaciones: number = 0;
  ingresosAplicaciones: number = 0;
  cantidadProductos: number = 0;
  ingresosProductos: number = 0;



  constructor(private clienteService: ClienteService,
    private mascotasService: MascotaService,
    private empleadoService: GestionVeterinariaService,

    private medicamentoService: GestionVeterinariaService,
    private listaEsperaService: SalaEsperaService,
    private sharedDataService: SharedDataGestionVeterinariaService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef, /* otros servicios inyectados */) { }


 ngOnInit() {
  this.listaEsperaService.getVentasDelDia().subscribe(ventas => {
    ventas.forEach((venta:any) => {
      venta.productos.forEach((producto:any) => {
        switch(producto.codigo) {
          case 'Baño':
            this.cantidadBanios++;
            this.ingresosBanios += producto.total;
            break;
          case 'estetica':
            this.cantidadEsteticas++;
            this.ingresosEsteticas += producto.total;
            break;
          case 'consultas':
            this.cantidadConsultas++;
            this.ingresosConsultas += producto.total;
            break;
          case 'aplicacion':
            this.cantidadAplicaciones++;
            this.ingresosAplicaciones += producto.total;
            break;
            default:
              this.cantidadProductos++;
              this.ingresosProductos += producto.total;
              break;
        }
      });
    });
  });
}
}