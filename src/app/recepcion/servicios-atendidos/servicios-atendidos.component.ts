import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SalaEsperaService } from '../../servicios/sala-espera.service';
import { Subscription } from 'rxjs';
import { format } from 'date-fns';
import { SharedDataService } from '../../servicios/shared-data.service';

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
  atendidoSelecionado: any;

  constructor(private _listEspetaFB: SalaEsperaService,private sharedDataService: SharedDataService
    
  ) { }

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
        const serviciosAtendidosAgrupados: {[key: string]: any} = {};

        servicios.filter(item => item.status === 'atendido').forEach(item => {
          const clienteId = item.cliente.id;
          const mascotaId = item.mascota.id;
  
          // Crear una clave única para el cliente y la mascota
          const clave = `${clienteId}-${mascotaId}`;
  
          if (!serviciosAtendidosAgrupados[clave]) {
            // Si no existe un registro para este cliente y mascota, crear uno
            serviciosAtendidosAgrupados[clave] = {
              cliente: item.cliente,
              mascota: item.mascota,
              servicios: [item],
            };
          } else {
            // Si ya existe un registro, agregar el servicio a la lista de servicios
            serviciosAtendidosAgrupados[clave].servicios.push(item);
          }
        });
  
        // Convertir el objeto a un array de servicios
        this.serviciosAtendidos = Object.values(serviciosAtendidosAgrupados);
        
        this.serviciosAtendidos = servicios.filter(item => item.status === 'atendido');

        // Ordenar los servicios por cliente y mascota
        this.serviciosAtendidos.sort((a, b) => {
          // Comparamos por cliente
          if (a.cliente.id !== b.cliente.id) {
            return a.cliente.id > b.cliente.id ? 1 : -1;
          }
        
          // Si los clientes son iguales, comparamos por mascota
          if (a.mascota.id !== b.mascota.id) {
            return a.mascota.id > b.mascota.id ? 1 : -1;
          }
        
          // En caso de que no se cumpla ninguna de las condiciones anteriores, devolvemos 0
          return 0;
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


  enviaWhatsApp(serv: any): void {
    //console.log('Enviando mensaje de WhatsApp a', serv);
   // window.open(`https://wa.me/+52${serv.cliente.telefonos[1]}?text=Estimado ${serv.cliente.nombre}, su mascota ya está lista para ser recogida en nuestra clínica. ¡Esperamos verlo pronto!`);

// Número de teléfono del cliente recibido como parámetro
const numeroCliente = serv.cliente.telefonos[1];

// Mensaje para enviar al cliente
const mensaje = 'Hola, su mascota ya está lista para ser recogida. ¡Esperamos verlo pronto!';

// Llamar a la función con el número de teléfono y el mensaje
this.enviarMensajeWhatsApp(numeroCliente, mensaje);
  }

// Función para enviar un mensaje de WhatsApp utilizando la API de WhatsApp Business y cerrar la ventana después de 5 segundos
enviarMensajeWhatsApp(numero: any, mensaje: any) {
  // Construir la URL de la API de WhatsApp Business
  const apiUrl = 'https://api.whatsapp.com/send?phone=+52' + numero + '&text=' + encodeURIComponent(mensaje);

  // Abrir una nueva ventana del navegador con la URL de la API
  const ventana = window.open(apiUrl);

  // Verificar si se pudo abrir la ventana
  if (ventana) {
    // Cerrar la ventana después de 5 segundos (5000 milisegundos)
    setTimeout(() => {
      ventana.close();
    }, 5000);
  } else {
    // La ventana no se pudo abrir
    console.error('No se pudo abrir la ventana de WhatsApp.');
  }
}
seleccionarAtendido(atendido: any, event: Event) {
  this.atendidoSelecionado = atendido;

  // Obtener el cliente y la mascota del servicio seleccionado
  const clienteSeleccionado = atendido.cliente;
  const mascotaSeleccionada = atendido.mascota;

  // Filtrar los servicios para encontrar aquellos que tienen el mismo cliente y mascota
  this.serviciosAtendidos.forEach(servicio => {
    // Si el servicio tiene el mismo cliente y mascota que el seleccionado, lo marcamos como seleccionado
    if (servicio.cliente.id === clienteSeleccionado.id && servicio.mascota.id === mascotaSeleccionada.id) {
      servicio.selected = true;
    } else {
      servicio.selected = false;
    }
  });



  this.sharedDataService.cambiarAtendido(this.atendidoSelecionado);

  console.log('Atendido seleccionado:', this.atendidoSelecionado);
}






}
