import { ApiProperty } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({
    description: 'Nombre común de la planta',
    default: 'Rosa',
  })
  public nombrecomun: string;

  @ApiProperty({
    description: 'Nombre científico de la planta',
    default: 'Rosa rubiginosa',
  })
  public nombrecientifico: string;

  @ApiProperty({
    description: 'Tamaño de la planta',
    default: 'Mediano',
  })
  public tamano: string;

  @ApiProperty({
    description: 'Cantidad de luz requerida',
    default: 'Alta',
  })
  public luzrequerida: string;

  @ApiProperty({
    description: 'Frecuencia de riego',
    default: 'Semanal',
  })
  public frecuenciaderiego: string;

  @ApiProperty({
    description: 'Nivel de humedad ideal',
    default: 'Alta',
  })
  public humedadideal: string;

  @ApiProperty({
    description: 'Temperatura ideal minima',
    default: '20°',
  })
  public tempidealmin: string;

  @ApiProperty({
    description: 'Temperatura ideal maxima',
    default: '25°',
  })
  public tempidealmax: string;

  @ApiProperty({
    description: 'Toxicidad para mascotas',
    default: 'No',
  })
  public toxicidadparamascotas: string;

  @ApiProperty({
    description: 'Tipo de suelo',
    default: 'Arenoso',
  })
  public tiposuelo: string;

  @ApiProperty({
    description: 'Sustrato sugerido',
    default: 'Sustrato universal',
  })
  public sustratosugerido: string;

  @ApiProperty({
    description: 'Fertilizante sugerido',
    default: 'Fertilizante orgánico',
  })
  public fertilizantesugerido: string;

  @ApiProperty({
    description: 'Dificultad de cuidado',
    default: 'Baja',
  })
  public dificultaddecuidado: string;

  @ApiProperty({
    description: 'Cantidad de stock disponible',
    default: 100,
  })
  public stock: number;

  @ApiProperty({
    description: 'Precio del producto',
    default: 50000,
  })
  public precio: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    default: 'http://default.com/imagen.jpg',
  })
  public imagen: string;

  @ApiProperty({
    description: 'unidades vendidas',
    default: 0,
  })
  public unidadesvendidas: number;
}
