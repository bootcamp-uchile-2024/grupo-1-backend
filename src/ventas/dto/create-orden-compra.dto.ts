import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsInt, ValidateIf } from 'class-validator';

export class CreateOrdenCompraDto {
  @ApiProperty({
    example: 'rodrigoc@gmail.com',
    description:
      'Correo electrónico del usuario (debe ser un correo con formato válido)',
  })
  @ValidateIf((o) => !o.idUsuario) // Valida solo si no hay idUsuario
  @IsEmail({}, { message: 'El email debe ser un correo electrónico válido' })
  public emailComprador?: string;

  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
    default: 0,
  })
  @ValidateIf((o) => !o.emailComprador) // Valida solo si no hay emailComprador
  @IsInt({ message: 'El idUsuario debe ser un número entero válido' })
  public idUsuario?: number;
}
