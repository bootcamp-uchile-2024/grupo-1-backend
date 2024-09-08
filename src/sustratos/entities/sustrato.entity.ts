import { Producto } from 'src/productos/entities/producto.entity';
import {
  ComposicionSustrato,
  RetencionHumedad,
  TexturaSustrato,
} from './enum-sustratos';
import { ApiProperty } from '@nestjs/swagger';
import { TipoPlantasRecomendadas } from 'src/fertilizantes/entities/enum-fertilizantes';
import { TipoProductos } from 'src/productos/entities/enum-productos';

export class Sustrato extends Producto {
  @ApiProperty({
    name: 'idSustrato',
    example: 1,
    description: 'Identificador del sustrato autoincremental',
  })
  public idSustrato: number;
  @ApiProperty({
    name: 'categoria',
    example: TipoProductos.Sustratos,
    description: 'Tipo de producto a crear (Sustrato)',
  })
  categoria: TipoProductos; //plantas/ maceteros/ sustratos/ fertilizantes/ controldeplagas
  @ApiProperty({
    name: 'nombreProducto',
    example: 'Mezcla para plantas de interior con perlita',
    description: 'Nombre del producto',
  })
  nombreProducto: string;
  @ApiProperty({
    name: 'urlImagen',
    example: 'http://default.com/sustrato1.jpg',
    description: 'URL de la imagen del producto',
  })
  urlImagen: string[];
  @ApiProperty({
    name: 'descripcionProducto',
    example: 'descripcion del producto sustrato',
    description: 'descripcion del producto en stock',
  })
  descripcionProducto: string;
  @ApiProperty({
    name: 'valorProducto',
    example: 5000,
    description: 'Valor del producto',
  })
  valorProducto: number;
  @ApiProperty({
    name: 'descuento',
    example: 0,
    description: 'Descuento del producto',
  })
  descuento: number;
  @ApiProperty({
    name: 'valorNormal',
    example: 8000,
    description: 'Valor normal del producto',
  })
  valorNormal?: number;
  @ApiProperty({
    name: 'composicion',
    example: 'Turba, Perlita',
    description: 'Composicion del sustrato',
  })
  composicion: ComposicionSustrato[];
  @ApiProperty({
    name: 'textura',
    example: 'Ligero, Aireado',
    description: 'Textura del sustrato',
  })
  textura: TexturaSustrato[];
  @ApiProperty({
    name: 'retencionDeHumedad',
    example: 'Media',
    description: 'Retencion de humedad del sustrato',
  })
  retencionDeHumedad: RetencionHumedad;
  @ApiProperty({
    name: 'drenaje',
    example: 'Bueno',
    description: 'Drenaje del sustrato',
  })
  drenaje: string;
  @ApiProperty({
    name: 'plantasRecomendadas',
    enum: TipoPlantasRecomendadas,
    example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
    description: 'Tipo de plantas recomendadas',
  })
  plantasRecomendadas: TipoPlantasRecomendadas;
  @ApiProperty({
    name: 'observaciones',
    example:
      'Ideal para plantas de interior que necesitan un buen equilibrio entre retención de humedad y drenaje.',
    description: 'Observaciones del sustrato',
  })
  observaciones: string;
  //  @ApiProperty({
  //    type: [ComposicionSustrato],
  //    isArray: true,
  //    description: 'Lista de Composicion',
  //    example: ['Turba', 'Perlita'],
  //  })
  //  public composicion: ComposicionSustrato[];
  //  @ApiProperty({
  //    type: [TexturaSustrato],
  //    isArray: true,
  //    description: 'Lista de texturas',
  //    example: ['Ligero', 'Aireado'],
  //  })
  //  public textura: TexturaSustrato[];
  //  @ApiProperty({
  //    name: 'Retemcion Humedad',
  //    example: RetencionHumedad.MEDIA,
  //    enum: RetencionHumedad,
  //  })
  //  public retencionHumedad: RetencionHumedad;
  //  @ApiProperty({
  //    name: 'observaciones',
  //    example:
  //      'Ideal para plantas de interior que necesitan un buen equilibrio entre retención de humedad y drenaje.',
  //  })
  //  public observaciones: string;
  //  @ApiProperty({
  //    name: 'Tipo Plantas Recomendadas',
  //    enum: TipoPlantasRecomendadas,
  //    example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
  //  })
  //  public tiposPlantasRecomendadas: TipoPlantasRecomendadas;
}
