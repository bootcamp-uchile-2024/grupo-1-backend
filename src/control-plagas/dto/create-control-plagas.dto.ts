import { ApiProperty } from "@nestjs/swagger";
import { CreateProductoDto } from "src/productos/dto/create-producto.dto";
import { Eficacia, MetodoAplicacion, TipoPlaga } from "../entities/enum-control-plagas";
import { IsBoolean, IsEnum, IsString } from "class-validator";

export class CreateControlPlagasDto extends CreateProductoDto {

  @IsEnum(TipoPlaga)
  @ApiProperty({
    type: [TipoPlaga],
    isArray: true,
    description: 'Lista de Plagas controladas',
    example: ['Pulgones', 'Cochinillas', 'Acaros' ]
})
public TipoPlagaControlada: TipoPlaga[];

@ApiProperty({
    name: 'Composicion Producto ',
    example: 'Aceite de neem(azadiractina)'
})
public composicion: string;

@IsEnum(MetodoAplicacion)
@ApiProperty({
    type: [MetodoAplicacion],
    isArray: true,
    description: 'Metodos de Aplicacion Producto',
    example: ['Spray foliar']
})
public metodoAplicacion: MetodoAplicacion[];

@IsString()
@ApiProperty({
    name: 'frecuencia Aplicacion',
    example: 'Cada 7-14 días según la infestación'
})
public frecuenciaAplicacion: string;

@IsString()
@ApiProperty({
    name: 'precauciones',
    example: 'Seguridad para mascotas, evitar el contacto directo con ojos y piel'
})
public precauciones: string;

@IsEnum(Eficacia)
@ApiProperty({
    name: 'Eficacia',
    example: Eficacia.ALTA,
    enum: Eficacia,
})
public eficacia: Eficacia;

@IsBoolean()
@ApiProperty({
    description: 'Indica si el producto es tóxico',
    example: true
})
public Toxicidad: boolean;
}
