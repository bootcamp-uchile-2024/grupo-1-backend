import { ApiProperty } from "@nestjs/swagger";
import { EstadosOC } from "./enum-orden-compra";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { DetalleOrdenCompra } from "src/detalle-orden-compras/entities/detalle-orden-compra.entity";
import { Despacho } from "src/despachos/entities/despacho.entity";

export class OrdenCompra {
    @ApiProperty({
        name: 'id',
        example: 1,
      })
      public idOC: number;
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
        name: 'id Usuario',
        example: 1,
        default: null
      })
    public cliente: number;
    //public cliente: Usuario;
    public detalle: DetalleOrdenCompra[];
    public despacho :Despacho;
}
