import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/productos/entities/producto.entity";
import { TipoFertizante, TipoPlantasRecomendadas } from "./enum-fertilizantes";
import { TipoProductos } from "src/productos/entities/enum-productos";

export class Fertilizante extends Producto {

  @ApiProperty({
    name: 'Composicion (NPK)',
    example: '20-20-20'
  })
  public composición: string;
  @ApiProperty({
    name: 'Tipo Fertilizante',
    enum: TipoFertizante, example: TipoFertizante.EQUILIBRADO_LIQUIDO,
  })
  public tipo: TipoFertizante;
  @ApiProperty({
    name: 'Frecuencia Aplicacion',
    example: 'Cada 2 semanas en primavera y verano'
  })
  public frecuenciaAplicacion: string;
  @ApiProperty({
    name: 'Presentacion Fertilizante',
    example: '500 cc'
  })
  public presentacion: string;
  @ApiProperty({
    name: 'observaciones',
    example: ' Adecuado para plantas que requieren un balance NPK equilibrado.'
  })
  public observaciones: string;
  @ApiProperty({
    name: 'Tipo Plantas Recomendadas',
    enum: TipoPlantasRecomendadas, example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
  })
  public tiposPlantasRecomendadas: TipoPlantasRecomendadas;

  constructor(
    idProducto: number, 
    nombreProducto: string, 
    imagenProducto: string[], 
    descuento: number, 
    precioNormal: number, 
    coberturaDeDespacho: string[], 
    stock: number, 
    descripcionProducto: string, 
    idCategoria: TipoProductos, 
    valoracion: number, 
    cantidadVentas: number, 
    codigoProducto: string,
    composición: string, 
    tipo: TipoFertizante, 
    frecuenciaAplicacion: string, 
    presentacion: string, 
    observaciones: string, 
    tiposPlantasRecomendadas: TipoPlantasRecomendadas
  ) {
    super(
      idProducto, 
      nombreProducto, 
      imagenProducto, 
      descuento, 
      precioNormal, 
      coberturaDeDespacho, 
      stock, 
      descripcionProducto, 
      idCategoria, 
      valoracion, 
      cantidadVentas, 
      codigoProducto
    );

    this.composición = composición;
    this.tipo = tipo;
    this.frecuenciaAplicacion = frecuenciaAplicacion;
    this.presentacion = presentacion;
    this.observaciones = observaciones;
    this.tiposPlantasRecomendadas = tiposPlantasRecomendadas;
  }

}
