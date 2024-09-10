import { ApiProperty } from "@nestjs/swagger";
import { CreateProductoDto } from "src/productos/dto/create-producto.dto";
import { TipoFertizante, TipoPlantasRecomendadas } from "../entities/enum-fertilizantes";
import { IsEnum, IsString } from "class-validator";

export class CreateFertilizanteDto extends CreateProductoDto {
  @IsString()
  @ApiProperty({
    name: 'Composicion (NPK)',
    example: '20-20-20'
  })
  public composición: string;
  @IsEnum(TipoFertizante)
  @ApiProperty({
    name: 'Tipo Fertilizante',
    enum: TipoFertizante, example: TipoFertizante.EQUILIBRADO_LIQUIDO,
  })
  public tipo: TipoFertizante;
  @IsString()
  @ApiProperty({
    name: 'Frecuencia Aplicacion',
    example: 'Cada 2 semanas en primavera y verano'
  })
  public frecuenciaAplicacion: string;
  @IsString()
  @ApiProperty({
    name: 'Presentacion Fertilizante',
    example: '500 cc'
  })
  public presentacion: string;
  @IsString()
  @ApiProperty({
    name: 'observaciones',
    example: ' Adecuado para plantas que requieren un balance NPK equilibrado.'
  })
  public observaciones: string;
  @IsEnum(TipoPlantasRecomendadas)
  @ApiProperty({
    name: 'Tipo Plantas Recomendadas',
    enum: TipoPlantasRecomendadas, example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
  })
  public tiposPlantasRecomendadas: TipoPlantasRecomendadas;

}
