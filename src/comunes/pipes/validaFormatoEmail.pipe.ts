import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { IsEmail } from 'class-validator';

@Injectable()
export class ValidaForamteEmailPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // Valida si el valor es un correo electrónico válido
    if (!IsEmail(value)) {
      throw new BadRequestException('El email proporcionado no es válido');
    }
    return value;
  }
}
