import { ApiProperty } from "@nestjs/swagger";
import { Producto } from "src/productos/entities/producto.entity";
import { Eficacia, MetodoAplicacion, TipoPlaga } from "./enum-control-plagas";
import { TipoProductos } from "src/productos/entities/enum-productos";

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

    constructor(idProducto: number, nombreProducto: string, imagenProducto: string[],
        descuento: number, precioNormal: number, coberturaDeDespacho: string[],
        stock: number, descripcionProducto: string, idCategoria: TipoProductos,
        valoracion: number, cantidadVentas: number, codigoProducto: string,
        tipoPlagaControlada:TipoPlaga[],composicion:string,metodoAplicacion:MetodoAplicacion[],
        frecuenciaAplicacion: string,precauciones: string,eficacia: Eficacia,Toxicidad: boolean) {
        super(idProducto, nombreProducto, imagenProducto,
            descuento, precioNormal, coberturaDeDespacho,
            stock, descripcionProducto, idCategoria,
            valoracion, cantidadVentas, codigoProducto);
        this.TipoPlagaControlada = tipoPlagaControlada;
        this.composicion = composicion;
        this.metodoAplicacion = metodoAplicacion;
        this.frecuenciaAplicacion = frecuenciaAplicacion;
        this.precauciones = precauciones;
        this.eficacia = eficacia;
        this.Toxicidad = Toxicidad;
    }
}

