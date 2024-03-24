// Interfaz para definir la estructura del cliente
export interface Cliente {
    id?: string;
    codigo: string;
    nombres: string[];
    direcciones: string[];
    telefonos: string[];
    advertencias: string[];
    bonos: string[];
    fechaRegistro?: string;
  }
  
  // Interfaz para definir la estructura de los filtros de búsqueda
  export interface Filtros {
    nombre: string;
    direccion: string;
    telefono: string;
    // Agrega aquí más propiedades de filtro si es necesario
  }
  