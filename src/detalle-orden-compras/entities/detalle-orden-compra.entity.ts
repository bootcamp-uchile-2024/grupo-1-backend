import { ApiProperty } from "@nestjs/swagger";

export class DetalleOrdenCompra {
    @ApiProperty({
        name: 'id OC',
        example: 1,
      })
      public idOC: number;
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
      public precio: number;
      @ApiProperty({
        description: 'Total Producto',
        example: 3000,
      })
      public totalProducto: number;
      @ApiProperty({
        description: 'descuento Producto',
        example: 500,
      })
      public descuento: number;/*deberia ser entidad con vigencia de descuento por producto y depende de la fecha de la compra esto puede ser 0 o el valor  */

}
