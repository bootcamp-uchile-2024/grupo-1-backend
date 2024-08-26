import { ApiProperty } from "@nestjs/swagger";

export class CreateDetalleOrdenCompraDto {
    @ApiProperty({
        name: 'id Producto',
        example: 1,
      })
      public idProducto: number;
   
      @ApiProperty({
        description: 'Cantidad Compra ',
        example: 2,
      })
      public cantidad: number;
      @ApiProperty({
        description: 'Precio Compra',
        example: 1500,
      })
     
      @ApiProperty({
        description: 'descuento Producto',
        example: 500,
      })
      public descuento: number;/*deberia ser entidad con vigencia de descuento por producto y depende de la fecha de la compra esto puede ser 0 o el valor  */

}
