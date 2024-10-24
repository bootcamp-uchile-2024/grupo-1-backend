import { ApiProperty } from '@nestjs/swagger';
import { Planta } from 'entitipt/planta.entity';
export class VerUsuarioDto {
  @ApiProperty()
  public nombre: string;
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public plantas: Planta[];
  constructor(nombre: string, email: string, plantas: Planta[]) {
    this.nombre = nombre;
    this.email = email;
    this.plantas = plantas;
  }
}
