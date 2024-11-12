import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreatePerfilDto {
  @ApiProperty({
    description: 'Descripción del perfil',
    example: 'Administrador',
  })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiProperty({
    description: 'Acceso al sistema',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  accesoSistema: boolean;
}
