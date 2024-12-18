import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Comuna } from 'src/localizaciones/entities/comuna.entity';
import { NombrePerfil, Perfil } from '../entities/perfil.entity';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { CreatePerfilDto } from '../dto/create-perfil.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comuna)
    private readonly comunaRepository: Repository<Comuna>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuarioExistentePorRut = await this.usuarioRepository.findOneBy({
      rutUsuario: createUsuarioDto.rutUsuario,
    });
    if (usuarioExistentePorRut) {
      throw new ConflictException(
        `El RUT ${createUsuarioDto.rutUsuario} ya está registrado`,
      );
    }
    const usuarioExistentePorEmail = await this.usuarioRepository.findOneBy({
      email: createUsuarioDto.email,
    });
    if (usuarioExistentePorEmail) {
      throw new ConflictException(
        `El correo electrónico ${createUsuarioDto.email} ya está registrado`,
      );
    }

    // Verificar si la comuna existe
    const comuna = await this.comunaRepository.findOneBy({
      id: createUsuarioDto.idComuna,
    });
    if (!comuna) {
      throw new NotFoundException(
        `Comuna con ID ${createUsuarioDto.idComuna} no encontrada`,
      );
    }

    // Verificar si el perfil existe
    const perfil = await this.perfilRepository.findOneBy({
      id: createUsuarioDto.idPerfil,
    });
    if (!perfil) {
      throw new NotFoundException(
        `Perfil con ID ${createUsuarioDto.idPerfil} no encontrado`,
      );
    }

    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      comuna,
      perfil,
    });

    try {
      return await this.usuarioRepository.save(nuevoUsuario);
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario');
    }
  }

  async findAll(): Promise<Usuario[]> {
    try {
      return await this.usuarioRepository.find();
    } catch (error) {
      throw new BadRequestException('Error al obtener los usuarios');
    }
  }

  async findOne(id: number): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async findOneOC(id: number): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      return null;
    }
  }
  async remove(identificador: string): Promise<Usuario> {
    let usuario: Usuario;
    if (isNaN(Number(identificador))) {
      usuario = await this.findUsuarioByRut(identificador);
    } else {
      usuario = await this.findOne(Number(identificador));
    }
    if (!usuario) {
      throw new NotFoundException(
        `Usuario con ID ${identificador} no encontrado`,
      );
    }
    try {
      const result = await this.usuarioRepository.delete(usuario.id);
      if (result.affected === 0) {
        throw new NotFoundException(
          `Usuario con ID ${identificador} no encontrado`,
        );
      }
    } catch (error) {
      throw new BadRequestException('Error al eliminar el usuario');
    }
    return usuario;
  }
  async findUsuarioByRut(rut: string): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOneOrFail({
        where: { rutUsuario: rut },
      });
    } catch (error) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }
  }
  async updateUsuario(
    identificador: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    let usuario: Usuario;

    if (isNaN(Number(identificador))) {
      // Buscar por RUT
      usuario = await this.findUsuarioByRut(identificador);
    } else {
      // Buscar por ID
      usuario = await this.findOne(Number(identificador));
    }

    Object.assign(usuario, updateUsuarioDto);
    try {
      return await this.usuarioRepository.save(usuario);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }
  async createPerfil(createPerfilDto: CreatePerfilDto): Promise<Perfil> {
    const nuevoPerfil = this.perfilRepository.create(createPerfilDto);
    try {
      // Intenta guardar el perfil en la base de datos.
      return await this.perfilRepository.save(nuevoPerfil);
    } catch (error) {
      // Loggea el error con un mensaje claro.
      console.error('Error al guardar el perfil:', error.message, error.stack);

      // Opcionalmente, puedes verificar el tipo de error para lanzar mensajes específicos.
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El perfil ya existe.');
      }

      // Lanza una excepción genérica si no es un caso específico.
      throw new BadRequestException('Error al crear el perfil');
    }
  }

  async findAllPerfil(): Promise<Perfil[]> {
    try {
      return await this.perfilRepository.find();
    } catch (error) {
      throw new BadRequestException('Error al obtener los perfiles');
    }
  }

  async findOnePerfil(id: number): Promise<Perfil> {
    try {
      return await this.perfilRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
  }

  async updatePerfil(
    id: number,
    updatePerfilDto: UpdatePerfilDto,
  ): Promise<Perfil> {
    const perfil = await this.findOnePerfil(id);

    Object.assign(perfil, updatePerfilDto);
    try {
      return await this.perfilRepository.save(perfil);
    } catch (error) {
      throw new BadRequestException('Error al actualizar el perfil');
    }
  }

  async deletePerfil(id: number): Promise<void> {
    const perfil: Perfil = await this.findOnePerfil(id);

    if (!perfil) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }

    if (perfil.nombrePerfil === NombrePerfil.ADMIN) {
      throw new BadRequestException('No se puede eliminar el perfil de admin.');
    }

    const perfilesDuplicados = await this.findPerfilesDuplicados(
      perfil.nombrePerfil,
    );
    if (perfilesDuplicados.length > 1) {
      throw new BadRequestException('No pueden haber perfiles duplicados.');
    }

    const result = await this.perfilRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
  }
  async findPerfilesDuplicados(nombrePerfil: NombrePerfil): Promise<Perfil[]> {
    return await this.perfilRepository.find({
      where: { nombrePerfil: nombrePerfil },
    });
  }

  async findPasswordByEmail(email: string): Promise<Usuario> {
    try {
      return await this.usuarioRepository.findOneOrFail({
        where: { email: email },
      });
    } catch (error) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
  }
}
