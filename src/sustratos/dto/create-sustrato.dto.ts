import { ApiProperty } from "@nestjs/swagger";
import { TipoPlantasRecomendadas } from "src/fertilizantes/entities/enum-fertilizantes";
import { CreateProductoDto } from "src/productos/dto/create-producto.dto";
import { ComposicionSustrato, RetencionHumedad, TexturaSustrato } from "../entities/enum-sustratos";

export class CreateSustratoDto extends CreateProductoDto {

 

  @ApiProperty({
    example: 'Mezcla para plantas de interior con perlita', // Valor sobrescrito en la clase hija
  })
  public nombreProducto: string;
  @ApiProperty({
    example: 80
  })
  public stock: number;

  @ApiProperty({
    example: 1500
  })
  public precio: number;
  @ApiProperty({
    example: 'http://default.com/sustrato.jpg'
  })
  public imagen: string;
  @ApiProperty({
    name: 'valoracion',
    example: 0
  })

  @ApiProperty({
    type: [ComposicionSustrato],
    isArray: true,
    description: 'Lista de Composicion',
    example: ['Turba', 'Perlita']
  })
  public composicion: ComposicionSustrato[];
  @ApiProperty({
    type: [TexturaSustrato],
    isArray: true,
    description: 'Lista de texturas',
    example: ['Ligero', 'Aireado']
  })
  public textura: TexturaSustrato[];
  @ApiProperty({
    name: 'Retemcion Humedad',
    example: RetencionHumedad.MEDIA,
    enum: RetencionHumedad,
  })
  public retencionHumedad: RetencionHumedad;
  @ApiProperty({
    name: 'observaciones',
    example: 'Ideal para plantas de interior que necesitan un buen equilibrio entre retención de humedad y drenaje.'
  })
  public observaciones: string;
  @ApiProperty({
    name: 'Tipo Plantas Recomendadas',
    enum: TipoPlantasRecomendadas, example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
  })
  public tiposPlantasRecomendadas: TipoPlantasRecomendadas;

}
