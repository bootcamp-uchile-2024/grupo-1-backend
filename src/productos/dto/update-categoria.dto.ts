import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateCategoriaDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Plantas',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreCategoria: string;
}
