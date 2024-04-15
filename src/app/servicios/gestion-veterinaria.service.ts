import { Injectable } from '@angular/core';
import { CollectionReference, DocumentData, addDoc, collection, deleteDoc, doc, updateDoc } from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class GestionVeterinariaService {
  private medicamentosCollection: CollectionReference<DocumentData>;
  private serviciosCollection: CollectionReference<DocumentData>;
  private descripcionesCollection:CollectionReference<DocumentData>;
  private empleadosCollection: CollectionReference<DocumentData>;


  constructor(private readonly firestore: Firestore) {
    this.medicamentosCollection = collection(this.firestore, 'medicamentos');
    this.serviciosCollection = collection(this.firestore, 'servicios');
    this.descripcionesCollection = collection(this.firestore, 'descripciones');
    this.empleadosCollection = collection(this.firestore, 'empleados');
  }

  agregarMedicamento(medicamento: any): Promise<any> {
    return addDoc(this.medicamentosCollection, medicamento);
  }

  getAllMedicamentos() {
    return collectionData(this.medicamentosCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  // Nuevo método para eliminar un medicamento
  eliminarMedicamento(medicamentoId: string) {
    const medicamentoDocRef = doc(this.medicamentosCollection, medicamentoId);
    return deleteDoc(medicamentoDocRef);
  }

  actualizarMedicamento(medicamentoId: string, data: Partial<any>): Observable<void> {
    const medicamentoDocRef = doc(this.medicamentosCollection, medicamentoId);

    return new Observable(observer => {
      updateDoc(medicamentoDocRef, data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

 //---------------------- servicios  ----------------------------- 
  
  agregarServicio(servicio: any): Promise<any> {
    return addDoc(this.serviciosCollection, servicio);
  }
  
  getAll() {
    return collectionData(this.serviciosCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }
  
  // Método para eliminar un servicio
  eliminarServicio(servicioId: string) {
    const servicioDocRef = doc(this.serviciosCollection, servicioId);
    return deleteDoc(servicioDocRef);
  }
  
  updateServicio(servicioId: string, data: Partial<any>): Observable<void> {
    const servicioDocRef = doc(this.serviciosCollection, servicioId);
  
    return new Observable(observer => {
      updateDoc(servicioDocRef, data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }
  


  //------------------- descripcopn 

  getAllDescripciones(): Observable<any[] | null> {
    return collectionData(this.descripcionesCollection, { idField: 'id' }) as Observable<any[]>;
  }


  addDescripcion(descripcion: any): Promise<any> {
    return addDoc(this.descripcionesCollection, descripcion);
  }


  //-------------------------empelados--------------------------
  agregarEmpleado(empleado: any): Promise<any> {
    return addDoc(this.empleadosCollection, empleado);
  }
  
  getAllEmpleados() {
    return collectionData(this.empleadosCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }
  
  eliminarEmpleado(empleadoId: string) {
    const empleadoDocRef = doc(this.empleadosCollection, empleadoId);
    return deleteDoc(empleadoDocRef);
  }
  
  actualizarEmpleado(empleadoId: string, data: Partial<any>): Observable<void> {
    const empleadoDocRef = doc(this.empleadosCollection, empleadoId);
  
    return new Observable(observer => {
      updateDoc(empleadoDocRef, data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });

  }

  insertVacunas(mascotaId: string, data: Partial<any>): Observable<void> {
    const mascotaCollection = collection(this.firestore, 'mascotas');
    const clienteDocRef = doc(mascotaCollection, mascotaId);

    return new Observable(observer => {
      updateDoc(clienteDocRef, data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }

}
