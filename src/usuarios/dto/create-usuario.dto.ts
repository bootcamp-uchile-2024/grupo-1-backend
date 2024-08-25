import { ApiProperty } from '@nestjs/swagger';
import { ComunaSantiago } from '../entities/comunas.stgo-enum';

export class CreateUsuarioDto {
  @ApiProperty({ name: 'rut', example: '12345678-9' })
  public rut: string;
  @ApiProperty({ name: 'nombre', example: 'Juan' })
  public nombre: string;
  @ApiProperty({ name: 'apellido', example: 'Perez' })
  public apellido: string;
  @ApiProperty({ name: 'email', example: 'mail@emaildeprueba.cl' })
  public email: string;
  @ApiProperty({ name: 'password', example: 'password' })
  private password: string;
  @ApiProperty({ name: 'telefono', example: '+56912345678' })
  public telefono: string;
  @ApiProperty({ name: 'direccion', example: 'Calle Falsa 123' })
  public direccion: string;
  @ApiProperty({ name: 'ciudad', example: 'Santiago' })
  public ciudad: string;
  @ApiProperty({ name: 'region', example: 'Metropolitana' })
  public region: string;
  @ApiProperty({ name: 'comuna', example: 'Santiago' })
  public comuna: ComunaSantiago;
  @ApiProperty({ name: 'codigoPostal', example: '1234567' })
  public codigoPostal: string;
  @ApiProperty({ name: 'fechaNacimiento', example: '1990-01-01' })
  public fechaNacimiento: Date;
}
