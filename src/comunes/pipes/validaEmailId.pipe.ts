import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { CreateOrdenCompraDto } from 'src/ventas/dto/create-orden-compra.dto';
import { UsuariosService } from 'src/usuarios/service/usuarios.service';
@Injectable()
export class ValidaEmailIdPipe implements PipeTransform {
  constructor(private readonly usuarioService: UsuariosService) {}
  async transform(value: CreateOrdenCompraDto, { metatype }: ArgumentMetadata) {
    const { emailComprador, idUsuario } = value;
    if (Number(idUsuario) == 0) {
      if (emailComprador && !this.isValidEmail(emailComprador)) {
        throw new BadRequestException('Email o id de usuario no válido.');
      } else {
        value.idUsuario = null;
      }
    } else {
      if (idUsuario) {
        const usuario = await this.usuarioService.findOneOC(idUsuario);
        if (!usuario) {
          if (!emailComprador) {
            throw new BadRequestException('Email o id de usuario no válido.');
          } else {
            if (this.isValidEmail(emailComprador)) {
              value.idUsuario = null; // Permite que siga solo con email
            } else {
              throw new BadRequestException('Email o id de usuario no válido.');
            }
          }
        } else {
          value.emailComprador = '';
        }
      } else {
        if (emailComprador && !this.isValidEmail(emailComprador)) {
          throw new BadRequestException('El email proporcionado no es válido');
        }
      }
    }
    return value;
  }
  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}
