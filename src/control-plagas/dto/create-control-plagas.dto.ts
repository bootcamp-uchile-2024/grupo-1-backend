import { ApiProperty } from "@nestjs/swagger";
import { CreateProductoDto } from "src/productos/dto/create-producto.dto";
import { ComposicionControlPlaga, Eficacia, MetodoAplicacion, TipoPlaga } from "../entities/enum-control-plagas";

export class CreateControlPlagasDto extends CreateProductoDto {
 /* @ApiProperty({
    example: 4, // Valor sobrescrito en la clase hija
  })
  public id: number;*/
  @ApiProperty({
    example: 'Aceite de neem', // Valor sobrescrito en la clase hija
  })
  public nombreProducto: string;
  @ApiProperty({
    example: 150,
  })
  public stock: number;

  @ApiProperty({
    example: 8750,
  })
  public precio: number;
  @ApiProperty({
    example: 'http://default.com/controlplaga.jpg'
  })
  public imagen: string;

  @ApiProperty({
    type: [TipoPlaga],
    isArray: true,
    description: 'Lista de Plagas controladas',
    example: ['Pulgones', 'Cochinillas', 'Acaros']
  })
  public TipoPlagaControlada: TipoPlaga[];
  @ApiProperty({
    type: [ComposicionControlPlaga],
    isArray: true,
    description: 'Lista de Composicion Producto ',
    example: ['Aceite de neem(azadiractina) ']
  })
  public composicion: ComposicionControlPlaga[];
  @ApiProperty({
    type: [MetodoAplicacion],
    isArray: true,
    description: 'Metodos de Aplicacion Producto',
    example: ['Spray foliar']
  })
  public metodoAplicacion: MetodoAplicacion[];
  @ApiProperty({
    name: 'frecuencia Aplicacion',
    example: 'Cada 7-14 días según la infestación'
  })
  public frecuenciaAplicacion: string;

  @ApiProperty({
    name: 'precauciones',
    example: 'Seguridad para mascotas, evitar el contacto directo con ojos y piel'
  })
  public precauciones: string;
  @ApiProperty({
    name: 'Eficacia',
    example: Eficacia.ALTA,
    enum: Eficacia,
  })
  public eficacia: Eficacia;

}
