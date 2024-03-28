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
import { where } from 'firebase/firestore/lite';
import { QueryDocumentSnapshot, QuerySnapshot, getDocs, onSnapshot, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'any'
})
export class MascotaService {
  private clientesCollection:CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.clientesCollection = collection(this.firestore, 'mascotas');
   }

  agregarMascota(cliente:any): Promise<any> {
    return addDoc(this.clientesCollection, cliente);
  }

  getAll():Observable<any | null>{
    return collectionData(this.clientesCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  getMascotaById(idMascota: string): Observable<any | null> {
    const mascotaDoc = doc(this.firestore, 'mascotas', idMascota);
    return docData(mascotaDoc, { idField: 'id' }) as Observable<any>;
  }

  getAllRazas():Observable<any | null>{
    const clientesCollection = collection(this.firestore, 'razas');
    return collectionData(clientesCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  getAllColores(): Observable<any | null> {
    const coloresCollection = collection(this.firestore, 'colores');
    return collectionData(coloresCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }
  

  getAllEspecies():Observable<any | null>{
    const especiesCollection = collection(this.firestore, 'especies');
    return collectionData(especiesCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  getAllTemperamentos(): Observable<any | null> {
    const temperamentosCollection = collection(this.firestore, 'temperamentos');
    return collectionData(temperamentosCollection, {
      idField: 'id',
    }) as Observable<any[]>;
  }

  addColor(color: any): Promise<any> {
    const coloresCollection = collection(this.firestore, 'colores');
    return addDoc(coloresCollection, color);
  }

  addTemperamento(temperamento: any): Promise<any> {
    const temperamentosCollection = collection(this.firestore, 'temperamentos');
    return addDoc(temperamentosCollection, temperamento);
  }
  
  

  addraza(raza:any): Promise<any> {

    const RazasCollection = collection(this.firestore, 'razas');
    return addDoc(RazasCollection, raza);
  }

  addEspecie(especie:any): Promise<any> {
   
    const especiesCollection = collection(this.firestore, 'especies');
    return addDoc(especiesCollection, especie);
  }

  async getMascotasPorCliente(idCliente: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const q = query(collection(this.firestore, 'mascotas'), where('idCliente', '==', idCliente));
      const mascotas: any[] = [];
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          const mascota: any = { id: change.doc.id, ...change.doc.data() };
          if (mascota.idCliente === idCliente) {
            if (change.type === "added") {
              mascotas.push(mascota);
            }
            if (change.type === "modified") {
              const index = mascotas.findIndex(m => m.id === mascota.id);
              if (index !== -1) {
                mascotas[index] = mascota;
              }
            }
            if (change.type === "removed") {
              const index = mascotas.findIndex(m => m.id === mascota.id);
              if (index !== -1) {
                mascotas.splice(index, 1);
              }
            }
          }
        });
        // Una vez que se han procesado todos los cambios, resuelve la promesa con las mascotas
        resolve(mascotas);
      }, error => {
        // Si hay un error en la consulta, rechaza la promesa con el error
        reject(error);
      });
    });
  }
  

  updateMascota(clienteId: string, data: Partial<any>): Observable<void> {
    const mascotaDocRef = doc(this.clientesCollection, clienteId);

    return new Observable(observer => {
      updateDoc(mascotaDocRef, data)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch(error => observer.error(error));
    });
  }


      // Nuevo método para eliminar un cliente
      eliminarMascota(mascotaID: string) {
        const mascotaDocRef = doc(this.clientesCollection, mascotaID);
        return deleteDoc(mascotaDocRef);
      }





}
