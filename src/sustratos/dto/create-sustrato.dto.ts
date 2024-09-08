import { ApiProperty } from '@nestjs/swagger';
import { TipoPlantasRecomendadas } from 'src/fertilizantes/entities/enum-fertilizantes';
import { CreateProductoDto } from 'src/productos/dto/create-producto.dto';
import {
  ComposicionSustrato,
  RetencionHumedad,
  TexturaSustrato,
} from '../entities/enum-sustratos';
import { TipoProductos } from 'src/productos/entities/enum-productos';

export class CreateSustratoDto extends CreateProductoDto {
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
  descuento?: number;
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
}
