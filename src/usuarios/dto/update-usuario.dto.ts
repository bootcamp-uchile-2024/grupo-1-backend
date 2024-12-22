import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEmail,
  IsInt,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UpdateUsuarioDto {
  @ApiProperty({
    description: 'RUT del usuario',
    example: '12345678-9',
  })
  @IsString()
  @IsNotEmpty({ message: 'El RUT del usuario es obligatorio' })
  @MaxLength(10, {
    message: 'El RUT del usuario no puede exceder los 10 caracteres',
  })
  rutUsuario: string;

  @ApiProperty({
    description: 'Nombres del usuario',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty({ message: 'Los nombres del usuario son obligatorios' })
  @MaxLength(255, {
    message: 'Los nombres del usuario no pueden exceder los 255 caracteres',
  })
  nombres: string;

  @ApiProperty({
    description: 'Apellidos del usuario',
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty({ message: 'Los apellidos del usuario son obligatorios' })
  @MaxLength(255, {
    message: 'Los apellidos del usuario no pueden exceder los 255 caracteres',
  })
  apellidos: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail({}, { message: 'El correo electrónico debe ser válido' })
  @IsNotEmpty({ message: 'El correo electrónico del usuario es obligatorio' })
  @MaxLength(255, {
    message:
      'El correo electrónico del usuario no puede exceder los 255 caracteres',
  })
  email: string;

  @ApiProperty({
    description: 'Teléfono del usuario',
    example: '987654321',
  })
  @IsInt({ message: 'El teléfono del usuario debe ser un número entero' })
  @IsOptional()
  telefono: number;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Calle Falsa 123',
  })
  @IsString()
  @IsNotEmpty({ message: 'La dirección del usuario es obligatoria' })
  @MaxLength(255, {
    message: 'La dirección del usuario no puede exceder los 255 caracteres',
  })
  direccion: string;

  @ApiProperty({
    description: 'ID de la comuna',
    example: 1,
  })
  @IsInt({ message: 'El ID de la comuna debe ser un número entero' })
  @IsOptional()
  idComuna?: number;

  @ApiProperty({
    description: 'ID del perfil',
    example: 1,
  })
  @IsInt({ message: 'El ID del perfil debe ser un número entero' })
  @IsOptional()
  idPerfil?: number;

  @ApiProperty({
    description: 'Código postal del usuario',
    example: '1234567',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'El código postal del usuario no puede exceder los 255 caracteres',
  })
  codigoPostal: string;

  @ApiProperty({
    description: 'Respuesta 1 de las preferencias del usuario',
    example: 'Respuesta 1',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 1 no puede exceder los 255 caracteres',
  })
  respuesta1?: string;

  @ApiProperty({
    description: 'Respuesta 2 de las preferencias del usuario',
    example: 'Respuesta 2',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 2 no puede exceder los 255 caracteres',
  })
  respuesta2?: string;

  @ApiProperty({
    description: 'Respuesta 3 de las preferencias del usuario',
    example: 'Respuesta 3',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 3 no puede exceder los 255 caracteres',
  })
  respuesta3?: string;

  @ApiProperty({
    description: 'Respuesta 4 de las preferencias del usuario',
    example: 'Respuesta 4',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 4 no puede exceder los 255 caracteres',
  })
  respuesta4?: string;

  @ApiProperty({
    description: 'Respuesta 5 de las preferencias del usuario',
    example: 'Respuesta 5',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 5 no puede exceder los 255 caracteres',
  })
  respuesta5?: string;

  @ApiProperty({
    description: 'Respuesta 6 de las preferencias del usuario',
    example: 'Respuesta 6',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 6 no puede exceder los 255 caracteres',
  })
  respuesta6?: string;

  @ApiProperty({
    description: 'Respuesta 7 de las preferencias del usuario',
    example: 'Respuesta 7',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 7 no puede exceder los 255 caracteres',
  })
  respuesta7?: string;

  @ApiProperty({
    description: 'Respuesta 8 de las preferencias del usuario',
    example: 'Respuesta 8',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 8 no puede exceder los 255 caracteres',
  })
  respuesta8?: string;

  @ApiProperty({
    description: 'Respuesta 9 de las preferencias del usuario',
    example: 'Respuesta 9',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La respuesta 9 no puede exceder los 255 caracteres',
  })
  respuesta9?: string;
}
