import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cobrar-modal',
  standalone: true,
  imports: [NgSelectModule,
    CommonModule,
FormsModule,
ReactiveFormsModule,
FirestoreModule,],
providers:[ToastrService],
  templateUrl: './cobrar-modal.component.html',
  styleUrl: './cobrar-modal.component.css'
})
export class CobrarModalComponent implements OnInit{

  cajaSeleccionada!: string;
  fechaActual: string = '';
  pagoEfectivo = 0;
  pagoTarjeta = 0;
  pagoTransferencia = 0;
  totalPagar = 0;
  cambio = 0;
  montoEntregado = 0;
  cargando=true;
  productos: any;  // Aquí defines la propiedad productos


  constructor( private changeDetector: ChangeDetectorRef, 
   private toastr: ToastrService,
       public activeModal: NgbActiveModal, /* otros servicios inyectados */) { }

  ngOnInit(): void {
    this.cargando = false;
    console.log('productos en el modal',this.productos);  // Aquí puedes ver los productos

    const fecha = new Date();
    fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset());
    this.fechaActual = fecha.toJSON().slice(0,10);

 // this.changeDetector.detectChanges();  // Forzar la detección de cambios
  }

  actualizarTotalEntregado() {
    this.montoEntregado = this.pagoEfectivo + this.pagoTarjeta + this.pagoTransferencia;
    this.actualizarCambio();
  }
  
  actualizarCambio() {
    this.cambio = this.montoEntregado - this.totalPagar;
  }

  closeModal() {
    this.activeModal.close(); // Cierra el modal
  }




realizarCobro(): void {
  // Solo procesar si el total a pagar está cubierto
  if (this.montoEntregado < this.totalPagar) {
    this.toastr.error(`El monto entregado no es suficiente. Faltan ${this.totalPagar - this.montoEntregado}`);
    return;
  }

  // Aquí va tu lógica para realizar el cobro
  // Por ejemplo, podrías sumar los pagos en efectivo, tarjeta y transferencia
  this.montoEntregado = this.pagoEfectivo + this.pagoTarjeta + this.pagoTransferencia;

  // Determinar las formas de pago
  let formasPago = [];
  if (this.pagoEfectivo > 0) {
    formasPago.push('Efectivo');
  }
  if (this.pagoTarjeta > 0) {
    formasPago.push('Tarjeta');
  }
  if (this.pagoTransferencia > 0) {
    formasPago.push('Transferencia');
  }

  // Y luego calcular el cambio
  const cambio = this.montoEntregado - this.totalPagar;

  // Finalmente, podrías mostrar un mensaje con el cambio
  if (cambio >= 0) {
    this.toastr.success(`El cambio es de ${cambio}`);
  }



    // Crear un objeto de resultado
    const resultado = {
      exitoso: true,
      totalPagar: this.totalPagar,
      montoEntregado: this.montoEntregado,
      cambio: cambio,
      formasPago: formasPago  // Agregar las formas de pago al resultado
    };

      // No olvides resetear los valores para la próxima venta
  this.pagoEfectivo = 0;
  this.pagoTarjeta = 0;
  this.pagoTransferencia = 0;
  this.totalPagar = 0;
  this.montoEntregado = 0;
  // Cerrar el modal
  this.activeModal.close(resultado);


  // Emitir un evento o llamar a una función de callback para indicar que el cobro fue exitoso
  // Por ejemplo:
  // this.onCobroExitoso.emit();
}
}