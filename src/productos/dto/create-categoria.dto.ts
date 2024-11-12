import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCategoriaDto {
  @ApiProperty({
    description: 'Nombre de la categoría',
    example: 'Plantas',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombreCategoria: string;
}
