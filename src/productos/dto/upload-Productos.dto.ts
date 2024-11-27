import { ApiProperty } from '@nestjs/swagger';

export class UploadProductImageDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Archivo de imagen para el producto.',
  })
  file: any;
}
