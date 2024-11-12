import { ApiProperty } from '@nestjs/swagger';
import { EstadoOrden } from '../enum/estadosOC';
export class GetOrdenDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  emailComprador: string;
  @ApiProperty()
  fechaOrden: Date;
  @ApiProperty()
  estado: EstadoOrden;
  @ApiProperty()
  idUsuario: number;
}
