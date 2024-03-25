export interface Servicio {
    id?: string;
    nombre: string;
    descripcion: string;
    categoria: string;
    fechaRegistro: string;
    precios: Precio[];
    precioUnitario:number,
    costosExtras: CostoExtra[];
    tipoPrecio:string
  }
  
  export interface Precio {
    precio: number;
    rangoPesoInicio: number;
    rangoPesoFin: number;
    talla: string;
  }
  
  export interface CostoExtra {
    nombre: string;
    precio: number;
  }