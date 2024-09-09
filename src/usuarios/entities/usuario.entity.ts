import { ApiProperty } from '@nestjs/swagger';
import { ComunaSantiago } from '../entities/comunas.stgo-enum';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  Length,
  IsEnum,
  Matches,
} from 'class-validator';

export class Usuario {
  @ApiProperty({
    name: 'rut',
    example: '12345678-9',
    description: 'RUT del usuario en formato chileno',
  })
  @IsString()
  @Matches(/^\d{7,8}-[0-9kK]$/, {
    message: 'El formato del RUT no es válido',
  })
  @IsNotEmpty()
  public rut: string;

  @ApiProperty({
    name: 'nombre',
    example: 'Juan Perez',
    description: 'Nombre completo del usuario',
  })
  @IsString()
  @IsNotEmpty()
  public nombre: string;

  @ApiProperty({
    name: 'email',
    example: 'mail@emaildeprueba.cl',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty({
    name: 'password',
    example: 'password',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  private password: string;

  @ApiProperty({
    name: 'telefono',
    example: '+56912345678',
    description: 'Número de teléfono del usuario',
  })
  @IsPhoneNumber('CL', {
    message: 'El número de teléfono debe ser válido en Chile',
  })
  @IsNotEmpty()
  public telefono: string;

  @ApiProperty({
    name: 'direccion',
    example: 'Calle Falsa 123',
    description: 'Dirección del usuario',
  })
  @IsString()
  @IsNotEmpty()
  public direccion: string;

  @ApiProperty({
    name: 'ciudad',
    example: 'Santiago',
    description: 'Ciudad de residencia del usuario',
  })
  @IsString()
  @IsNotEmpty()
  public ciudad: string;

  @ApiProperty({
    name: 'region',
    example: 'Metropolitana',
    description: 'Región de residencia del usuario',
  })
  @IsString()
  @IsNotEmpty()
  public region: string;

  @ApiProperty({
    name: 'comuna',
    example: 'Santiago',
    enum: ComunaSantiago,
    description: 'Comuna de residencia dentro de Santiago',
  })
  @IsEnum(ComunaSantiago)
  @IsNotEmpty()
  public comuna: string;

  @ApiProperty({
    name: 'codigoPostal',
    example: '1234567',
    description: 'Código postal de la dirección del usuario',
  })
  @Matches(/^\d{7}$/, {
    message: 'El código postal debe contener 7 dígitos',
  })
  @IsNotEmpty()
  public codigoPostal: string;
}
