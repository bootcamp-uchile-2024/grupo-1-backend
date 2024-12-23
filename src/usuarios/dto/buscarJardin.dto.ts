import { IsNumberString } from 'class-validator';

export class BuscarJardinQueryDto {
  @IsNumberString()
  idUsuario: string;
}
