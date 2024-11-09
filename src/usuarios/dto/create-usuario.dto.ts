import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'RUT del usuario',
    example: '12345678-9',
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  rutUsuario: string;

  @ApiProperty({
    description: 'Nombres del usuario',
    example: 'Juan',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Pérez',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  apellidos: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    description: 'Clave del usuario',
    example: 'clave123',
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  clave: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '987654321',
  })
  @IsInt()
  @IsOptional()
  telefono: number;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  direccion: string;

  @ApiProperty({
    description: 'ID de la comuna del usuario',
    example: 1,
  })
  @IsInt()
  idComuna: number;
  @IsNotEmpty()
  @ApiProperty({
    description: 'Código postal del usuario',
    example: '1234567',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  codigoPostal: string;

  @ApiProperty({
    description: 'ID del perfil del usuario',
    example: 2,
  })
  @IsInt()
  @IsOptional()
  idPerfil: number;
}
