import { DetalleOrdenCompra } from "src/detalle-orden-compras/entities/detalle-orden-compra.entity";

export class VerProductos{
  public id: number; 
  public nombreProducto: string; 
  public stock: number; 
  public precio: number; 
  public imagen: string; 
  public valoracion: number; 
  public cantidadVentas:number;
//  public ventaProductos: DetalleOrdenCompra[];
}