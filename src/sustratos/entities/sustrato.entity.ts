import { Producto } from "src/productos/entities/producto.entity";
import { ComposicionSustrato, RetencionHumedad, TexturaSustrato } from "./enum-sustratos";
import { ApiProperty } from "@nestjs/swagger";
import { TipoPlantasRecomendadas } from "src/fertilizantes/entities/enum-fertilizantes";

export class Sustrato extends Producto {


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
