import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/productos/entities/producto.entity";
import { TipoFertizante, TipoPlantasRecomendadas } from "./enum-fertilizantes";

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

  

}
