import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @ApiProperty({
    description: 'ID del usuario',
    example: 1,
    required: true,
  })
  @IsOptional()
  @IsNumber()
  id?: number;

  @ApiProperty({
    description: 'RUT del usuario',
    example: '12345678-9',
    required: true,
  })
  @IsOptional()
  @IsString()
  rutUsuario?: string;
}
