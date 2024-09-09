import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { ErrorPlantopia } from 'src/error-plantopia/error-plantopia';

@Injectable()
export class ValidaOrdenPipePipe implements PipeTransform {
  transform(value: any) {
    // Verifica campos en el nivel superior
    if (!value.emailComprador || value.emailComprador == undefined ||
        !value.idCliente || value.idCliente == undefined) {
      throw new ErrorPlantopia('Cada orden debe tener atributos emailComprador e idCliente.' ,404);
    }

    // Verifica que 'detalle' sea un array
    if (!Array.isArray(value.detalle)) {
      throw new ErrorPlantopia('El campo detalle debe ser un array.',404);
    }

    // Valida cada objeto dentro del array 'detalle'
    value.detalle.forEach(detalle => {
      if (!detalle.idProducto || detalle.cantidad === undefined || detalle.precio === undefined || detalle.descuento === undefined) {
        throw new ErrorPlantopia ('Cada detalle debe tener idProducto, cantidad,precio y descuento.',404);
      }
    });
 

    return value;
  }
}
