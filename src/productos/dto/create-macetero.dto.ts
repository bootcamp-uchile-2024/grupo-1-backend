import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, MaxLength } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class CreateMaceteroDto extends CreateProductoDto {
  @ApiProperty({
    description: 'Material del macetero',
    example: 'Cerámica',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  material: string;

  @ApiProperty({
    description: 'Altura del macetero en cm',
    example: 30,
  })
  @IsNumber()
  @IsNotEmpty()
  altura: number;

  @ApiProperty({
    description: 'Ancho del macetero en cm',
    example: 20,
  })
  @IsNumber()
  @IsNotEmpty()
  ancho: number;

  @ApiProperty({
    description: 'Color del macetero',
    example: 'Blanco',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  color: string;

  @ApiProperty({
    description: 'Peso del macetero en gramos',
    example: 1500,
  })
  @IsNumber()
  @IsNotEmpty()
  peso: number;

  @ApiProperty({
    description: 'ID de la forma del macetero',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  idForma: number;
}
