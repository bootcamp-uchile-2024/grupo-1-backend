import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsInt,
} from 'class-validator';

export class UpdateFertilizanteDto {
  @ApiProperty({
    description: 'Composición del fertilizante',
    example: 'NPK 20-20-20',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La composición no puede exceder los 255 caracteres',
  })
  composicion: string;

  @ApiProperty({
    description: 'Presentación del fertilizante',
    example: 'Bolsa de 1kg',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255, {
    message: 'La presentación no puede exceder los 255 caracteres',
  })
  presentacion: string;

  @ApiProperty({
    description: 'ID del tipo de fertilizante',
    example: 1,
  })
  @IsInt({
    message: 'El ID del tipo de fertilizante debe ser un número entero',
  })
  @IsOptional()
  idTipoFertilizante: number;
}
