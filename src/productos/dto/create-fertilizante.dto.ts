import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength, IsNumber } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class CreateFertilizanteDto extends CreateProductoDto {
  @ApiProperty({
    description: 'ID del tipo de fertilizante',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  idTipoFertilizante: number;

  @ApiProperty({
    description: 'Composición del fertilizante',
    example: 'NPK 10-10-10',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  composicion: string;

  @ApiProperty({
    description: 'Presentación del fertilizante',
    example: 'Líquido',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  presentacion: string;
}
