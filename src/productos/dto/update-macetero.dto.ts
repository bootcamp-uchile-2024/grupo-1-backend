import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMaceteroDto } from './create-macetero.dto';
import { IsOptional } from 'class-validator';

export class UpdateMaceteroDto extends PartialType(CreateMaceteroDto) {
  @ApiProperty({
    description: 'Material del macetero',
    example: 'Cerámica',
  })
  @IsOptional()
  material: string;

  @ApiProperty({
    description: 'Altura del macetero en cm',
    example: 30,
  })
  @IsOptional()
  altura: number;

  @ApiProperty({
    description: 'Ancho del macetero en cm',
    example: 20,
  })
  @IsOptional()
  ancho: number;

  @ApiProperty({
    description: 'Color del macetero',
    example: 'Blanco',
  })
  @IsOptional()
  color: string;

  @ApiProperty({
    description: 'Peso del macetero en gramos',
    example: 1500,
  })
  @IsOptional()
  peso: number;

  @ApiProperty({
    description: 'ID de la forma del macetero',
    example: 1,
  })
  @IsOptional()
  idForma: number;
}
