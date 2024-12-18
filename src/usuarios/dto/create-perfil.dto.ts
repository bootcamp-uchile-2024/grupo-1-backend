import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty, IsEnum } from 'class-validator';
import { NombrePerfil } from '../entities/perfil.entity';

export class CreatePerfilDto {
  @ApiProperty({
    description: 'Nombre del perfil',
    example: NombrePerfil.USER,
  })
  @IsEnum(NombrePerfil)
  @IsNotEmpty()
  nombrePerfil: NombrePerfil;

  @ApiProperty({
    description: 'Acceso al sistema',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  accesoSistema: boolean;
}
