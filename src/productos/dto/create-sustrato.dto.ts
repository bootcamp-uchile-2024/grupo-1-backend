import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class CreateSustratoDto extends CreateProductoDto {
  @ApiProperty({
    description: 'Nombre del sustrato',
    example: 'Sustrato universal',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ApiProperty({
    description: 'Descripción del sustrato',
    example: 'Sustrato adecuado para todo tipo de plantas',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  descripcion?: string;

  @ApiProperty({
    description: 'Precio del sustrato',
    example: 10.99,
  })
  @IsNumber()
  @IsNotEmpty()
  precioNormal: number;

  @ApiProperty({
    description: 'Stock del sustrato',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  stock: number;
}
