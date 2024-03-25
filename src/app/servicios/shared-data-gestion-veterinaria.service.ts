import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Medicamento } from '../gestionVeterinaria/medicamento/registro-medicamento/registro-medicamento.component';
import { Servicio } from '../shared/interfaces/servicios-veterinarios.interface';
import { Empleado } from '../shared/interfaces/empleado.interface';

@Injectable({
  providedIn: 'root'
})
export class SharedDataGestionVeterinariaService {
  private medicamentoSeleccionadoSubject: BehaviorSubject<Medicamento | null>;
  public medicamentoSeleccionado$: Observable<Medicamento | null>;

  private servicioSeleccionadoSubject: BehaviorSubject<Servicio | null>;
  public servicioSeleccionado$: Observable<Servicio | null>;

  private empleadoSeleccionadoSubject: BehaviorSubject<Empleado | null>;
public empleadoSeleccionado$: Observable<Empleado | null>;

  constructor() {
    this.medicamentoSeleccionadoSubject = new BehaviorSubject<Medicamento | null>(null);
    this.medicamentoSeleccionado$ = this.medicamentoSeleccionadoSubject.asObservable();
  
    this.servicioSeleccionadoSubject = new BehaviorSubject<Servicio | null>(null);
    this.servicioSeleccionado$ = this.servicioSeleccionadoSubject.asObservable();

    this.empleadoSeleccionadoSubject = new BehaviorSubject<Empleado | null>(null);
    this.empleadoSeleccionado$ = this.empleadoSeleccionadoSubject.asObservable();
  
  }

  setMedicamentoSeleccionado(medicamento: Medicamento | null): void {
    this.medicamentoSeleccionadoSubject.next(medicamento);
  }

  getMedicamentoSeleccionado(): Observable<Medicamento | null> {
    return this.medicamentoSeleccionado$;
  }



  //---------------------servicos ------------------------ 

  setServicioSeleccionado(servicio: Servicio | null): void {
    this.servicioSeleccionadoSubject.next(servicio);
  }
  
  getServicioSeleccionado(): Observable<Servicio | null> {
    return this.servicioSeleccionado$;
  }


  //-------------------empleado ---------------------------
  setEmpleadoSeleccionado(empleado: Empleado | null): void {
    this.empleadoSeleccionadoSubject.next(empleado);
  }
  
  getEmpleadoSeleccionado(): Observable<Empleado | null> {
    return this.empleadoSeleccionado$;
  }



}