import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,where
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { getDocs, onSnapshot, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'any'
})
export class SalaEsperaService {
  private esperaCollection: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.esperaCollection = collection(this.firestore,'salaEspera');
  }

  getListaEspera(): Observable<any[]> {
    return collectionData(this.esperaCollection, {
       idField: 'id' 
      }) as Observable<any[]>;
  }


  getAllListasConEstatus(estatus: string): Observable<any[]> {
    // Obtener una referencia a la colección
    const coleccion = collection(this.firestore,'salaEspera');
  
    // Crear una consulta
    const consulta = query(coleccion, where('status', '==', estatus));
  
    // Crear un observable para escuchar los cambios en tiempo real
    return new Observable(observer => {
      const unsubscribe = onSnapshot(consulta, (snapshot) => {
        // Convertir los documentos a un array de objetos e incluir el ID del documento
        const ListaEspera = snapshot.docs.map(doc => {
          const data = doc.data();
          data['id'] = doc.id;  // Agregar el ID del documento
          return data;
        });
        observer.next(ListaEspera);
      });
  
      // Devolver una función de limpieza que se llamará cuando el observable se desuscriba
      return unsubscribe;
    });
  }
  
  
  getAllListasConEstatus1(estatus: string): Observable<any[]> {
    // Obtener una referencia a la colección
    const coleccion = collection(this.firestore,'salaEspera');
  
    // Crear una consulta
    const consulta = query(coleccion, where('status', '==', estatus));
  
    // Crear un observable para escuchar los cambios en tiempo real
    return new Observable(observer => {
      const unsubscribe = onSnapshot(consulta, (snapshot) => {
        // Convertir los documentos a un array de objetos
        const ListaEspera = snapshot.docs.map(doc => doc.data());
        observer.next(ListaEspera);
      });
  
      // Devolver una función de limpieza que se llamará cuando el observable se desuscriba
      return unsubscribe;
    });
  }

  updateListaEspera(listaEsperaId: string, data: Partial<any>): Observable<void> {
    const listaEsperaDocRef = doc(this.firestore, 'salaEspera', listaEsperaId);
  
    return new Observable(observer => {
      updateDoc(listaEsperaDocRef, data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }
  

  

  agregarItemList(item: any): Promise<any> {
    return addDoc(this.esperaCollection, item);
  }
}
