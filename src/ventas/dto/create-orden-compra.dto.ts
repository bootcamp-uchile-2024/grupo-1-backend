import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
export class CreateOrdenCompraDto {
  @ApiProperty({
    example: 'rodrigoc@gmail.com',
    description:
      'Correo electrónico del usuario (debe ser un correo con formato válido)',
  })
  @IsEmail({}, { message: 'El email debe ser un correo electrónico válido' })
  public emailComprador?: string;
  @ApiProperty({
    description: 'id Usuario',
    example: 1,
    default: 0,
  })
  public idUsuario?: number;
}
