import { ApiProperty } from "@nestjs/swagger";
import { CreateProductoDto } from "src/productos/dto/create-producto.dto";
import { TipoFertizante, TipoPlantasRecomendadas } from "../entities/enum-fertilizantes";

export class CreateFertilizanteDto extends CreateProductoDto {
      /*  @ApiProperty({
          example: 2, // Valor sobrescrito en la clase hija
        })
        public id: number;*/
        @ApiProperty({
          example: 'Fertilizante equilibrado 20-20-20', // Valor sobrescrito en la clase hija
        })
        public nombreProducto: string;
        @ApiProperty({
          example: 1200,
        })
        public stock: number;
        
        @ApiProperty({
          example: 2500,
        })
        public precio: number;
        @ApiProperty({
            example: 'http://default.com/fertilizante.jpg'
        })
        public imagen: string;
    @ApiProperty({
        description: 'marca Fertilizante',
        example: 'MasVida'
      })
    public marca:string;
    @ApiProperty({
        description: 'Composicion (NPK)',
        example: '20-20-20'
      })
    public composición:string;
    @ApiProperty({
        description: 'Tipo Fertilizante',
        enum: TipoFertizante, example: TipoFertizante.EQUILIBRADO_LIQUIDO,
      })
      public tipo: TipoFertizante;
      @ApiProperty({
        description: 'Frecuencia Aplicacion',
        example: 'Cada 2 semanas en primavera y verano'
      })
    public frecuenciaAplicacion :string; 
    @ApiProperty({
        description: 'Presentacion Fertilizante',
        example: '500 cc'
      })
    public presentacion :string; 
    @ApiProperty({
        description: 'observaciones',
        example: ' Adecuado para plantas que requieren un balance NPK equilibrado.'
      })
    public observaciones :string; 

      @ApiProperty({
        description: 'Tipo Plantas Recomendadas',
        enum: TipoPlantasRecomendadas, example: TipoPlantasRecomendadas.PLANTAS_INTERIOR,
      })
      public tiposPlantasRecomendadas	: TipoPlantasRecomendadas;  

}
