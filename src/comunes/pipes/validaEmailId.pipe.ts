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
    console.log('el id es;a: ', idUsuario);
    if (Number(idUsuario) == 0) {
      if (emailComprador && !this.isValidEmail(emailComprador)) {
        throw new BadRequestException('Email o id de usuario no válido1.');
      } else {
        value.idUsuario = null;
      }
    }
    if (Number(idUsuario) > 0) {
      const usuario = await this.usuarioService.findOneOC(idUsuario);
      console.log(usuario);
      if (!usuario) {
        throw new BadRequestException('Email o id de usuario no válidoA.');
      } else {
        value.emailComprador = null;
      }
    }

    return value;
  }
  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}
