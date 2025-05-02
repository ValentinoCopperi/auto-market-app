import { Cliente } from "./cliente";


export interface Publicacion {
    id: number;
    modelo:string;
    marca:Marca;
    precio:number;
    anio:number;
    tipo_transmision:string;
    tipo_combustible:string;
    color :string;
    kilometraje : number;
    publicacion_imagenes : PublicacionImagen[];
    destacado : boolean;
    descripcion : string;
    categoria : Categoria;
    ciudad:string;
    tipo_moneda : 'USD' | 'ARG';
    titulo : string;
    created_at : Date;
    cliente: ClienteVendedor;
    url_portada? : string;
}

export interface PublicacionCompleto extends Publicacion {
    cliente: Cliente;
}

export interface Marca {
    id: number;
    nombre: string;
    cantidad_publicaciones?: number;
}

export interface ClienteVendedor {
    id: number;
    nombre: string;
}

export interface PublicacionImagen {
    id: number;
    url: string;
}



export type Categoria = "automovil" | "camioneta" | "motocicleta" | "comercial"

