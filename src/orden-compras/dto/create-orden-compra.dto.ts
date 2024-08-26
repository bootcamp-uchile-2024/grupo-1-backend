import { ApiProperty } from "@nestjs/swagger";
import { EstadosOC } from "../entities/enum-orden-compra";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { DetalleOrdenCompra } from "src/detalle-orden-compras/entities/detalle-orden-compra.entity";
import { Despacho } from "src/despachos/entities/despacho.entity";

export class CreateOrdenCompraDto {
    @ApiProperty({
        description: 'fecha OC',
        example: '15/07/2024',
    })
    public fechaOC: Date;
    @ApiProperty({
        name: 'Estado OC',
        enum: EstadosOC, example: EstadosOC.CREADA,
    })
    public estadoOC: EstadosOC;

    @ApiProperty({
        name: 'id Cliente',
        example: 1,
        default: null
      })
    public cliente: number;
    @ApiProperty({
        type: [DetalleOrdenCompra],
        isArray: true,
        description: 'Detalle OC',
        example: [
          {
            'idProducto': '1',
            'cantidad': '2',
            'precio': '1500',
            'descuento': '500',
          },
          {
            'idProducto': '2',
            'cantidad': '4',
            'precio': '3500',
            'descuento': '0',
          },
        ]
      })
    public detalle: DetalleOrdenCompra[];
    @ApiProperty({
      type: Despacho,
      isArray: false,
      description: 'Despacho',
      example:  
        {
           'Id' : '1',
           'EstadosDespacho' : 'Creado',
           'fechaEstimada' : '30/08/2024',
           'nroSeguimiento' : '152525',
           'proveedorDespacho' : 'Blue-Express'

        
        } 
      
    })
   public despacho :Despacho;

}
