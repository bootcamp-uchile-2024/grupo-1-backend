import { VerDetalleOrdenCompraDto } from './verDetalleOrden.dto';
export class GetOrdenCompraConDetalleDto {
  id: number;
  emailComprador: string;
  fechaOrden: Date;
  estado: string;
  idUsuario: number;
  detalles: VerDetalleOrdenCompraDto[];
}
