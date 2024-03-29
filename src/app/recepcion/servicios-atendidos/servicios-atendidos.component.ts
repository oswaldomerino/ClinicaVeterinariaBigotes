import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';

@Component({
  selector: 'app-servicios-atendidos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios-atendidos.component.html',
  styleUrl: './servicios-atendidos.component.css'
})
export class ServiciosAtendidosComponent implements OnInit, OnDestroy {
  serviciosAtendidos: any[] = [];
  subscription: Subscription = new Subscription;

  constructor(private _listEspetaFB: SalaEsperaService) { }

  ngOnInit(): void {
    this.cargarServiciosAtendidos();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarServiciosAtendidos(): void {
    this.subscription = this._listEspetaFB.getAllListasConEstatus('atendido').subscribe(servicios => {
      if(servicios){
        this.serviciosAtendidos = servicios.filter(item => item.status === 'atendido');

        this.serviciosAtendidos.sort((a, b) => {
          const horaTerminoA = new Date(a.horaTermino).getTime();
          const horaTerminoB = new Date(b.horaTermino).getTime();
          return horaTerminoA - horaTerminoB;
        });

this.serviciosAtendidos.forEach(item => {
  if (item.horaTerminoAtencion) {
    const fechaTermino = new Date(item.horaTerminoAtencion);
    if (!isNaN(fechaTermino.getTime())) {  // Comprueba si la fecha es válida
      item.horaTerminoAtencion = format(fechaTermino, 'HH:mm');
    }
  }

  if (item.horaRecepcion) {
    const fechaRecepcion = new Date(item.horaRecepcion);
    if (!isNaN(fechaRecepcion.getTime())) {  // Comprueba si la fecha es válida
      item.horaRecepcion = format(fechaRecepcion, 'HH:mm');
    }
  }

  if (item.horaCita) {
    const fechaCita = new Date(item.horaCita);
    if (!isNaN(fechaCita.getTime())) {  // Comprueba si la fecha es válida
      item.horaCita = format(fechaCita, 'HH:mm');
    }
  }


  if (item.cliente.telefonos) {
    item.cliente.telefonos.forEach((telefono: string) => {
      const telefonoSinEspacios = telefono.replace(/\s/g, '');
      let telefonoFormateado = telefonoSinEspacios;
      if (telefonoSinEspacios.startsWith('52')) {
        telefonoFormateado = '+52' + telefonoSinEspacios.substring(2);
      } else if (telefonoSinEspacios.startsWith('1')) {
        telefonoFormateado = '+1' + telefonoSinEspacios.substring(1);
      }
      item.cliente.telefonos.push(telefonoFormateado);
    });
  }

});
      }
    });
  }
}
