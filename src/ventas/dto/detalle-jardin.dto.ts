import { ApiProperty } from '@nestjs/swagger';
import { PlantaDto } from 'src/productos/dto/planta.dto';

export class DetalleJardinVirtualDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  usuarioId: number;

  @ApiProperty()
  nombreUsuario: string;

  @ApiProperty()
  jardinId: number;

  @ApiProperty()
  plantas: PlantaDto[]; // Asegúrate de tener un DTO para Planta

  @ApiProperty({ type: Date })
  fechaIngreso: Date;
}
