import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/productos/entities/producto.entity";
import { Eficacia, MetodoAplicacion, TipoPlaga } from "./enum-control-plagas";

export class ControlPlagas extends Producto {

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

    @ApiProperty({
        description: 'Indica si el producto es tóxico',
        example: true
    })
    public Toxicidad: boolean;
}

