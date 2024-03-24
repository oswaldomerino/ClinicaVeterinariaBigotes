import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class ClienteService {
  private clientesCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.clientesCollection = collection(this.firestore, 'clientes');
  }

  agregarCliente(cliente: any): Promise<any> {
    return addDoc(this.clientesCollection, cliente);
  }

  getAll() {
    return collectionData(this.clientesCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  // Nuevo método para eliminar un cliente
  eliminarCliente(clienteId: string) {
    const clienteDocRef = doc(this.clientesCollection, clienteId);
    return deleteDoc(clienteDocRef);
  }

  updateCliente(clienteId: string, data: Partial<any>): Observable<void> {
    const clienteDocRef = doc(this.clientesCollection, clienteId);

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