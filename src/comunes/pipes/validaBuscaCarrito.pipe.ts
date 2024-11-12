import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/service/usuarios.service';
@Injectable()
export class ValidaBuscaCarritoPipe implements PipeTransform {
  constructor(private readonly usuarioService: UsuariosService) {}
  async transform(value: any, metadata: ArgumentMetadata) {
    const { emailComprador, idUsuario } = value;
    console.log(
      'Transform Pipe - emailComprador:',
      emailComprador,
      'idUsuario:',
      idUsuario,
    );

    if (!emailComprador && !idUsuario) {
      throw new BadRequestException('Debe ingresar email o rut para buscar ');
    }
    if (emailComprador && !this.isValidEmail(emailComprador)) {
      throw new BadRequestException('El email proporcionado no es válido');
    }
    if (idUsuario && Number(idUsuario) > 0) {
      const usuario = await this.usuarioService.findOneOC(idUsuario);
      if (!usuario) {
        throw new BadRequestException('No existe usuario');
      }
    }
    return value;
  }
  private isValidEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}
