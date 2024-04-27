import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,where, 
} from '@firebase/firestore';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { runTransaction } from "firebase/firestore";


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


  getAllListasActivas(): Observable<any[]> {
    // Obtener una referencia a la colección
    const coleccion = collection(this.firestore,'salaEspera');
  
    // Crear una consulta
    const consulta = query(coleccion, where('status', '!=', 'entregado'));
  
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

  getListaEsperaPorClienteYEstado(clienteId: string): Observable<any[]> {
  // Obtener una referencia a la colección
  const coleccion = collection(this.firestore,'salaEspera');

  // Crear una consulta
  const consulta = query(coleccion, where('cliente.id', '==', clienteId), where('status', '!=', 'entregado'));

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

 getVentasDelDia(): Observable<any[]> {
  // Obtener una referencia a la colección
  const coleccion = collection(this.firestore, 'ventas');

  // Obtener la fecha actual al inicio del día
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Obtener la fecha actual al final del día
  const manana = new Date(hoy);
  manana.setDate(hoy.getDate() + 1);

  // Convertir las fechas a cadenas en el formato "YYYY-MM-DD"
  const hoyStr = hoy.toISOString().split('T')[0];
  const mananaStr = manana.toISOString().split('T')[0];

  // Crear una consulta
  const consulta = query(coleccion, where('fecha', '>=', hoyStr), where('fecha', '<', mananaStr));

  // Crear un observable para escuchar los cambios en tiempo real
  return new Observable(observer => {
    const unsubscribe = onSnapshot(consulta, (snapshot) => {
      // Convertir los documentos a un array de objetos e incluir el ID del documento
      const ventas = snapshot.docs.map(doc => {
        const data = doc.data();
        data['id'] = doc.id;  // Agregar el ID del documento
        return data;
      });
      observer.next(ventas);
    });

    // Devolver una función de limpieza que se llamará cuando el observable se desuscriba
    return unsubscribe;
  });
}





 realizarVenta(venta:any, productos:any) {
  // Iniciar una transacción
  return runTransaction(this.firestore, async (transaction) => {
    try {
      // Actualizar la lista de espera seleccionada a pagado=true

for (const producto of productos) {
  if(producto.idListaEspera){
    const productoActualizado:any = {
      id: producto.idListaEspera,
      pagado: true
    }
    let listaEsperaRef = doc(this.firestore, 'salaEspera', productoActualizado.id);
    transaction.update(listaEsperaRef, {pagado: true});
    console.log('servicios que se van a pagar ',productoActualizado);
  }else{
    const productoActualizado:any = {
      id: producto.id,
      producto: producto.descripcion,
      descontarSrock: producto.cantidad
    }
    let productoRef = doc(this.firestore, 'medicamentos', productoActualizado.id);
    const productoDoc = await getDoc(productoRef);
    if (productoDoc.exists()) {
      const productoData:any = productoDoc.data();
      const nuevoStock = productoData.stock - productoActualizado.descontarSrock;
      transaction.update(productoRef, {stock: nuevoStock});
      console.log('productos que se van a descontar ', nuevoStock);
    } else {
      console.error('Producto no encontrado: ', productoActualizado.id);
    }
  }
}
      let ventasRef = doc(collection(this.firestore, 'ventas'));
transaction.set(ventasRef, venta);


//this.imprimirTicket(venta);

    } catch (error) {
      console.error('Error en la transacción:', error);
      throw error; // Re-lanza el error para que pueda ser manejado por el código que llama a esta función
    }
  })
  .then(() => {
    console.log('Transacción completada con éxito');
  })
  .catch((error) => {
    console.error('Error en la transacción:', error);
  });
}





imprimirTicket(venta: any) {
  // Crear una nueva ventana y mostrar el ticket
  let mywindow = window.open('', 'PRINT', 'height=400,width=600');
  if (mywindow) {
    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write('<style>');
    mywindow.document.write('body { font-family: Arial, sans-serif; }');
    mywindow.document.write('.header { text-align: center; }');
    mywindow.document.write('.item { border-bottom: 1px solid #000; padding: 5px 0; }');
    mywindow.document.write('</style>');
    mywindow.document.write('</head><body >');
    mywindow.document.write('<div class="header"><h1>Veterinaria XYZ</h1><p>Dirección de la veterinaria</p><p>Teléfono de la veterinaria</p></div>');
    mywindow.document.write('<h2>Detalles de la venta</h2>');
    mywindow.document.write('<p>ID de la venta: ' + venta.id + '</p>');
    mywindow.document.write('<p>Fecha de la venta: ' + venta.fecha + '</p>');
    mywindow.document.write('<p>Total de la venta: ' + venta.total + '</p>');
    mywindow.document.write('<h2>Detalles del cliente</h2>');
    mywindow.document.write('<p>Nombre del cliente: ' + venta.cliente.nombre + '</p>');
    mywindow.document.write('<p>Dirección del cliente: ' + venta.cliente.direccion + '</p>');
    mywindow.document.write('<h2>Productos</h2>');

    // Agregar información de los productos al ticket
    venta.productos.forEach((producto: any) => {
      mywindow?.document.write('<div class="item">');
      mywindow?.document.write('<p>Producto: ' + producto.descripcion + '</p>');
      mywindow?.document.write('<p>Cantidad: ' + producto.cantidad + '</p>');
      mywindow?.document.write('<p>Precio: ' + producto.precio + '</p>');
      mywindow?.document.write('</div>');
    });

    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }
  return true;
}
}
