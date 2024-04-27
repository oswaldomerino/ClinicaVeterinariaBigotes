import { Component, OnInit } from '@angular/core';

import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { formatDistanceStrict } from 'date-fns';
import { Subscription } from 'rxjs';
import { SharedDataService } from '../../servicios/shared-data.service';
import { CommonModule } from '@angular/common';

interface Vacuna {
  comentario: string;
  fechaAplicacion: string;
  idMedicamento: string;
  medicamento: string;
  periodicidad: number;
  pesoMascota: number;
  precioVacuna: number;
  proximaCita: string;
}


@Component({
  selector: 'app-mascota-detalle',
  standalone: true,
  imports: [CommonModule,NgbModule],
  templateUrl: './mascota-detalle.component.html',
  styleUrl: './mascota-detalle.component.css'
})
export class MascotaDetalleComponent {
 // Variables relacionadas con el plan de salud de la mascota
 planSaludVigente: boolean = false;
 proximaCita: string | null = 'sin datos';
 observaciones: string | null = 'sin datos';
 planSalud: boolean = false;
 vacunas: Vacuna[] = [];
 temperamento: string[] = ['Amigable']; // Por defecto, el temperamento es "Amigable"
 tratamientos: string[] = ['-'];
 edadMascota:string | null=null;
 nombreMascota:string | null=null;
 subscription: Subscription = new Subscription;
 pesoMascota: number = 0;

 constructor(
   private mascotaService: SharedDataService,
   private modalService: NgbModal
 ) { }

 ngOnInit(): void {
   // Suscribirse al observable para recibir la mascota seleccionada
   this.mascotaService.mascotaSeleccionadoObservable.subscribe(mascota => {
     if (mascota) {
       // Actualizar la información de la mascota
       this.infoMascota(mascota);
     }
   });
 }

 ngOnDestroy(): void {
   // Asegúrate de cancelar la suscripción cuando el componente se destruya
   if (this.subscription) {
     this.subscription.unsubscribe();
   }
 }

// Método para obtener información detallada de una mascota
infoMascota(mascota: any): void {
  if (mascota) {
    this.nombreMascota = mascota.nombre;
    this.calcularEdadMascota(mascota.fechaNacimiento);
    this.pesoMascota = mascota.peso || 0;

    // Actualizar el temperamento y observaciones de la mascota
    this.temperamento = mascota.temperamentos || ['Amigable'];
    this.observaciones = mascota.observaciones || 'sin datos';

    // Verificar si la mascota tiene vacunas
    if (mascota.vacunas) {
      this.vacunas = this.obtenerUltimaVacunaPorId(mascota.vacunas);
      this.planSalud = true; // La mascota tiene un plan de salud

      // Verificar si el plan de salud de la mascota está vigente
      this.planSaludVigente = this.verificarPlanSalud(this.vacunas[0]);
      this.proximaCita = this.planSaludVigente ? this.vacunas[0].proximaCita : '';
    } else {
      // La mascota no tiene un plan de salud
      this.vacunas = [];
      this.planSalud = false;
      this.planSaludVigente = false;
      this.proximaCita = '';
    }
  }
}

// Función para obtener solo la última vacuna aplicada por cada ID de medicamento
obtenerUltimaVacunaPorId(vacunas: any[]): any[] {
  // Crear un mapa para almacenar las vacunas por ID de medicamento y su fecha de aplicación
  const vacunasPorId = new Map();
  vacunas.forEach(vacuna => {
    // Si no hay ninguna vacuna almacenada para este ID de medicamento o la fecha de aplicación de esta vacuna es más reciente,
    // actualiza la vacuna almacenada para este ID de medicamento con la vacuna actual
    if (!vacunasPorId.has(vacuna.idMedicamento) || new Date(vacuna.fechaAplicacion) > new Date(vacunasPorId.get(vacuna.idMedicamento).fechaAplicacion)) {
      vacunasPorId.set(vacuna.idMedicamento, vacuna);
    }
  });

  // Convertir las vacunas del mapa a un array y devolverlo
  return Array.from(vacunasPorId.values());
}





 // Método privado para verificar si el plan de salud de la mascota está vigente
 private verificarPlanSalud(vacuna: Vacuna): boolean {
   const fechaActual = new Date();
   const partesFecha = vacuna.proximaCita.split('/');
   const dia = +partesFecha[0];
   const mes = +partesFecha[1] - 1;
   const anio = +partesFecha[2];
   const fechaProximaVacuna = new Date(anio, mes, dia);
   return fechaProximaVacuna.getTime() > fechaActual.getTime();
 }

 calcularEdadMascota(fechaNacimiento: any) {
   let fechaNacimientoDate = new Date(fechaNacimiento);
   let hoy = new Date();
   let diff = hoy.getTime() - fechaNacimientoDate.getTime();
   let edad = new Date(diff);
 
   let años = edad.getFullYear() - 1970;
   let meses = edad.getMonth();
   let días = edad.getDate();
 
   let edadMascota = '';
   if (años > 0) {
     edadMascota += `${años} años`;
   }
   if (meses > 0) {
     edadMascota += `${edadMascota ? ', ' : ''}${meses} meses`;
   }
   if (días > 0) {
     edadMascota += `${edadMascota ? ' y ' : ''}${días} días`;
   }
 
   this.edadMascota = edadMascota || 'Recién nacido';
 }
 
 

}
