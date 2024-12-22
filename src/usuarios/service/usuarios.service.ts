import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
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
import { Planta } from 'src/productos/entities/planta.entity';
import { http } from 'winston';
import { Preferencias } from '../entities/preferencias.entity';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name);

  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comuna)
    private readonly comunaRepository: Repository<Comuna>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    @InjectRepository(Preferencias)
    private readonly preferenciasRepository: Repository<Preferencias>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    this.logger.log(
      `Iniciando creación de usuario con RUT: ${createUsuarioDto.rutUsuario}`,
    );

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

    const comuna = await this.comunaRepository.findOneBy({
      id: createUsuarioDto.idComuna,
    });
    if (!comuna) {
      throw new NotFoundException(
        `Comuna con ID ${createUsuarioDto.idComuna} no encontrada`,
      );
    }

    const perfil = await this.perfilRepository.findOneBy({
      id: createUsuarioDto.idPerfil,
    });
    if (!perfil) {
      throw new NotFoundException(
        `Perfil con ID ${createUsuarioDto.idPerfil} no encontrado`,
      );
    }

    try {
      return await this.usuarioRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const nuevoUsuario = this.usuarioRepository.create({
            ...createUsuarioDto,
            comuna,
            perfil,
          });
          const savedUsuario =
            await transactionalEntityManager.save(nuevoUsuario);

          const preferencias = this.preferenciasRepository.create({
            respuesta1: createUsuarioDto.respuesta1,
            respuesta2: createUsuarioDto.respuesta2,
            respuesta3: createUsuarioDto.respuesta3,
            respuesta4: createUsuarioDto.respuesta4,
            respuesta5: createUsuarioDto.respuesta5,
            respuesta6: createUsuarioDto.respuesta6,
            respuesta7: createUsuarioDto.respuesta7,
            respuesta8: createUsuarioDto.respuesta8,
            respuesta9: createUsuarioDto.respuesta9,
            usuario: savedUsuario,
          });

          const savedPreferencias =
            await transactionalEntityManager.save(preferencias);

          // Formateamos la respuesta
          const response = {
            ...savedUsuario,
            respuesta1: savedPreferencias.respuesta1,
            respuesta2: savedPreferencias.respuesta2,
            respuesta3: savedPreferencias.respuesta3,
            respuesta4: savedPreferencias.respuesta4,
            respuesta5: savedPreferencias.respuesta5,
            respuesta6: savedPreferencias.respuesta6,
            respuesta7: savedPreferencias.respuesta7,
            respuesta8: savedPreferencias.respuesta8,
            respuesta9: savedPreferencias.respuesta9,
          };

          delete response.Preferencias;

          return response;
        },
      );
    } catch (error) {
      this.logger.error(
        `Error al crear usuario: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(
        `Error al crear el usuario: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Usuario[]> {
    this.logger.log('Consultando todos los usuarios');
    try {
      const usuarios = await this.usuarioRepository.find();
      this.logger.log(`Se encontraron ${usuarios.length} usuarios`);
      return usuarios;
    } catch (error) {
      this.logger.error('Error al obtener usuarios:', error.stack);
      throw new BadRequestException('Error al obtener los usuarios');
    }
  }

  async findOne(id: number): Promise<Usuario> {
    this.logger.log(`Buscando usuario con ID: ${id}`);
    try {
      const usuario = await this.usuarioRepository.findOneOrFail({
        where: { id },
      });
      this.logger.log(`Usuario encontrado con ID: ${id}`);
      return usuario;
    } catch (error) {
      this.logger.error(`Usuario con ID ${id} no encontrado`, error.stack);
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  async findOneOC(id: number): Promise<Usuario> {
    this.logger.log(`Buscando usuario opcional con ID: ${id}`);
    try {
      const usuario = await this.usuarioRepository.findOneOrFail({
        where: { id },
      });
      this.logger.log(`Usuario encontrado con ID: ${id}`);
      return usuario;
    } catch (error) {
      this.logger.warn(`Usuario con ID ${id} no encontrado - retornando null`);
      return null;
    }
  }
  async remove(identificador: string): Promise<Usuario> {
    this.logger.log(
      `Iniciando eliminación de usuario con identificador: ${identificador}`,
    );

    let usuario: Usuario;
    if (isNaN(Number(identificador))) {
      usuario = await this.findUsuarioByRut(identificador);
    } else {
      usuario = await this.findOne(Number(identificador));
    }
    if (!usuario) {
      this.logger.warn(
        `No se encontró usuario para eliminar con ID ${identificador}`,
      );
      throw new NotFoundException(
        `Usuario con ID ${identificador} no encontrado`,
      );
    }
    try {
      const result = await this.usuarioRepository.delete(usuario.id);
      if (result.affected === 0) {
        this.logger.warn(
          `No se encontró usuario para eliminar con ID ${identificador}`,
        );
        throw new NotFoundException(
          `Usuario con ID ${identificador} no encontrado`,
        );
      }
      this.logger.log(`Usuario eliminado exitosamente: ${identificador}`);
    } catch (error) {
      this.logger.error(
        `Error al eliminar usuario: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Error al eliminar el usuario');
    }
    return usuario;
  }
  async findUsuarioByRut(rut: string): Promise<Usuario> {
    this.logger.log(`Buscando usuario por RUT: ${rut}`);

    if (!rut) {
      this.logger.error('RUT no proporcionado');
      throw new BadRequestException('El RUT es requerido');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { rutUsuario: rut },
    });

    if (!usuario) {
      this.logger.warn(`No se encontró usuario con RUT: ${rut}`);
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    this.logger.log(`Usuario encontrado exitosamente con RUT: ${rut}`);
    return usuario;
  }
  async updateUsuario(
    identificador: string,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    this.logger.log(
      `Iniciando actualización de usuario con identificador: ${identificador}`,
    );
    let usuario: Usuario;

    try {
      if (isNaN(Number(identificador))) {
        this.logger.debug(`Buscando usuario por RUT: ${identificador}`);
        usuario = await this.findUsuarioByRut(identificador);
      } else {
        this.logger.debug(`Buscando usuario por ID: ${identificador}`);
        usuario = await this.findOne(Number(identificador));
      }

      Object.assign(usuario, updateUsuarioDto);
      const usuarioActualizado = await this.usuarioRepository.save(usuario);
      this.logger.log(`Usuario actualizado exitosamente: ${identificador}`);
      return usuarioActualizado;
    } catch (error) {
      this.logger.error(
        `Error al actualizar usuario: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Error al actualizar el usuario');
    }
  }
  async createPerfil(createPerfilDto: CreatePerfilDto): Promise<Perfil> {
    this.logger.log(
      `Iniciando creación de perfil: ${createPerfilDto.nombrePerfil}`,
    );
    const nuevoPerfil = this.perfilRepository.create(createPerfilDto);
    try {
      const perfilCreado = await this.perfilRepository.save(nuevoPerfil);
      this.logger.log(
        `Perfil creado exitosamente: ${createPerfilDto.nombrePerfil}`,
      );
      return perfilCreado;
    } catch (error) {
      this.logger.error(`Error al crear perfil: ${error.message}`, error.stack);
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El perfil ya existe.');
      }
      throw new BadRequestException('Error al crear el perfil', error);
    }
  }

  async findAllPerfil(): Promise<Perfil[]> {
    this.logger.log('Consultando todos los perfiles');
    try {
      const perfiles = await this.perfilRepository.find();
      this.logger.log(`Se encontraron ${perfiles.length} perfiles`);
      return perfiles;
    } catch (error) {
      this.logger.error('Error al obtener perfiles:', error.stack);
      throw new BadRequestException('Error al obtener los perfiles');
    }
  }

  async findOnePerfil(id: number): Promise<Perfil> {
    this.logger.log(`Buscando perfil con ID: ${id}`);
    try {
      const perfil = await this.perfilRepository.findOneOrFail({
        where: { id },
      });
      this.logger.log(`Perfil encontrado con ID: ${id}`);
      return perfil;
    } catch (error) {
      this.logger.error(`Perfil con ID ${id} no encontrado`, error.stack);
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
  }

  async updatePerfil(
    id: number,
    updatePerfilDto: UpdatePerfilDto,
  ): Promise<Perfil> {
    this.logger.log(`Iniciando actualización de perfil con ID: ${id}`);
    try {
      const perfil = await this.findOnePerfil(id);
      Object.assign(perfil, updatePerfilDto);
      const perfilActualizado = await this.perfilRepository.save(perfil);
      this.logger.log(`Perfil actualizado exitosamente: ${id}`);
      return perfilActualizado;
    } catch (error) {
      this.logger.error(
        `Error al actualizar perfil: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Error al actualizar el perfil');
    }
  }

  async deletePerfil(id: number): Promise<void> {
    this.logger.log(`Iniciando eliminación de perfil con ID: ${id}`);
    try {
      const perfil: Perfil = await this.findOnePerfil(id);

      if (perfil.nombrePerfil === NombrePerfil.ADMIN) {
        this.logger.warn(`Intento de eliminar perfil ADMIN rechazado`);
        throw new BadRequestException(
          'No se puede eliminar el perfil de admin.',
        );
      }

      const perfilesDuplicados = await this.findPerfilesDuplicados(
        perfil.nombrePerfil,
      );
      if (perfilesDuplicados.length > 1) {
        this.logger.warn(
          `Se encontraron perfiles duplicados para: ${perfil.nombrePerfil}`,
        );
        throw new BadRequestException('No pueden haber perfiles duplicados.');
      }

      const result = await this.perfilRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
      }
      this.logger.log(`Perfil eliminado exitosamente: ${id}`);
    } catch (error) {
      this.logger.error(
        `Error al eliminar perfil: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  async findPerfilesDuplicados(nombrePerfil: NombrePerfil): Promise<Perfil[]> {
    this.logger.log(`Buscando perfiles duplicados para: ${nombrePerfil}`);
    const perfiles = await this.perfilRepository.find({
      where: { nombrePerfil: nombrePerfil },
    });
    this.logger.log(
      `Se encontraron ${perfiles.length} perfiles con nombre: ${nombrePerfil}`,
    );
    return perfiles;
  }

  async findPasswordByEmail(email: string): Promise<Usuario> {
    this.logger.log(`Buscando usuario por email: ${email}`);
    try {
      const usuario = await this.usuarioRepository.findOneOrFail({
        where: { email: email },
      });
      this.logger.log(`Usuario encontrado con email: ${email}`);
      return usuario;
    } catch (error) {
      this.logger.error(
        `Usuario con email ${email} no encontrado`,
        error.stack,
      );
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
  }
}
