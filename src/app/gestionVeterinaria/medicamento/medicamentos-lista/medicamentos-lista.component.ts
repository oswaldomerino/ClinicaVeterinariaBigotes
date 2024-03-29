import { Component } from '@angular/core';
import { Medicamento } from '../registro-medicamento/registro-medicamento.component';
import { Subscription } from 'rxjs';
import { GestionVeterinariaService } from '../../../servicios/gestion-veterinaria.service';
import { SharedDataGestionVeterinariaService } from '../../../servicios/shared-data-gestion-veterinaria.service';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MascotasModule } from '../../../mascotas/mascotas.module';

@Component({
  selector: 'app-medicamentos-lista',
  standalone: true,
  imports: [CommonModule,FormsModule,NgbModule, MascotasModule],
  templateUrl: './medicamentos-lista.component.html',
  styleUrl: './medicamentos-lista.component.css'
})
export class MedicamentosListaComponent {

  medicamentos: Medicamento[] = [];
  filtro: string = '';
  subscription: Subscription = new Subscription;

  constructor( 
    private medicamentoService: GestionVeterinariaService,
    private sharedDataService: SharedDataGestionVeterinariaService

    ) { }

  ngOnInit(): void {
    this.obtenerMedicamentos();
  }

  obtenerMedicamentos(): void {
    this.medicamentoService.getAllMedicamentos().subscribe(
      medicamentos => this.medicamentos = medicamentos,
      error => console.error('Error al obtener los medicamentos', error)
    );
  }

  ngOnDestroy(): void {
    // Asegúrate de cancelar la suscripción cuando el componente se destruya
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  editarMedicamento(medicamento: Medicamento): void {
    this.sharedDataService.setMedicamentoSeleccionado(medicamento);
  }

  eliminarMedicamento(id: string): void {
    if (confirm('¿Estás seguro de eliminar este medicamento?')) {
      this.medicamentoService.eliminarMedicamento(id).then(
        () => {
          // Eliminar el medicamento de la lista localmente
          this.medicamentos = this.medicamentos.filter(medicamento => medicamento.id !== id);
          console.log('Medicamento eliminado exitosamente');
        },
        error => console.error('Error al eliminar el medicamento', error)
      );
    }
  }

  filtrarMedicamentos(): any[] {
    if (!this.filtro) {
      return this.medicamentos;
    }
    return this.medicamentos.filter(medicamento =>
      medicamento.nombreVacuna.toLowerCase().includes(this.filtro.toLowerCase())
      || medicamento.codigoBarras.toLowerCase().includes(this.filtro.toLowerCase())
      || medicamento.categoria.toLowerCase().includes(this.filtro.toLowerCase())
    );
  }
}
