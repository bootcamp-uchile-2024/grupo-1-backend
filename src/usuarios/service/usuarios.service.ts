import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Comuna } from 'src/localizaciones/entities/comuna.entity';
import { NombrePerfil, Perfil } from '../entities/perfil.entity';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { Preferencias } from '../entities/preferencias.entity';
import { UsuarioResponseDto } from '../dto/response-usuario.dto';

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
    const usuarios = await this.usuarioRepository.find({
      relations: ['comuna', 'perfil', 'Preferencias'],
    });

    return usuarios;
  }

  async findOne(id: number): Promise<Usuario> {
    this.logger.log(`Buscando usuario con ID: ${id}`);
    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoin('usuario.comuna', 'comuna')
        .leftJoin('usuario.perfil', 'perfil')
        .leftJoin('usuario.preferencias', 'preferencias')
        .select([
          'usuario.rutUsuario',
          'usuario.nombres',
          'usuario.apellidos',
          'usuario.email',
          'usuario.clave',
          'usuario.telefono',
          'usuario.direccion',
          'usuario.codigoPostal',
          'comuna.id',
          'perfil.id',
          'preferencias.respuesta1',
          'preferencias.respuesta2',
          'preferencias.respuesta3',
          'preferencias.respuesta4',
          'preferencias.respuesta5',
          'preferencias.respuesta6',
          'preferencias.respuesta7',
          'preferencias.respuesta8',
          'preferencias.respuesta9',
        ])
        .where('usuario.id = :id', { id })
        .getOne();

      if (!usuario) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      const response = {
        rutUsuario: usuario.rutUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        clave: usuario.clave,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        codigoPostal: usuario.codigoPostal,
        idComuna: usuario.comuna?.id,
        idPerfil: usuario.perfil?.id,
        respuesta1: usuario.Preferencias?.respuesta1,
        respuesta2: usuario.Preferencias?.respuesta2,
        respuesta3: usuario.Preferencias?.respuesta3,
        respuesta4: usuario.Preferencias?.respuesta4,
        respuesta5: usuario.Preferencias?.respuesta5,
        respuesta6: usuario.Preferencias?.respuesta6,
        respuesta7: usuario.Preferencias?.respuesta7,
        respuesta8: usuario.Preferencias?.respuesta8,
        respuesta9: usuario.Preferencias?.respuesta9,
      };
      const usuarioResponse: Usuario = {
        ...response,
        id: usuario.id,
        comuna: usuario.comuna,
        perfil: usuario.perfil,
        jardin: usuario.jardin,
        Preferencias: usuario.Preferencias,
        servicios: [],
        jardinVirtual: null,
        orden: [],
      };

      this.logger.log(`Usuario encontrado con ID: ${id}`);
      return usuarioResponse;
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
  async remove(identificador: string): Promise<void> {
    this.logger.log(
      `Iniciando eliminación de usuario con identificador: ${identificador}`,
    );

    try {
      const usuario = await this.findByIdOrRut(identificador);

      if (!usuario) {
        this.logger.warn(
          `Usuario no encontrado con identificador: ${identificador}`,
        );
        throw new NotFoundException(`Usuario no encontrado`);
      }

      try {
        await this.usuarioRepository.manager.transaction(
          async (transactionalEntityManager) => {
            await transactionalEntityManager
              .createQueryBuilder()
              .delete()
              .from('preferencias')
              .where('usuarioId = :id', { id: usuario.id })
              .execute();

            await transactionalEntityManager
              .createQueryBuilder()
              .delete()
              .from(Usuario)
              .where('id = :id', { id: usuario.id })
              .execute();
          },
        );

        this.logger.log(`Usuario eliminado exitosamente: ${identificador}`);
      } catch (error) {
        this.logger.error(
          `Error en la transacción de eliminación: ${error.message}`,
        );
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
          throw new BadRequestException(
            'No se puede eliminar el usuario porque tiene registros relacionados',
          );
        }
        throw error;
      }
    } catch (error) {
      this.logger.error(`Error al eliminar usuario: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Error interno del servidor al eliminar el usuario',
      );
    }
  }
  async findUsuarioByRut(rut: string): Promise<Usuario> {
    this.logger.log(`Buscando usuario por RUT: ${rut}`);

    if (!rut) {
      this.logger.error('RUT no proporcionado');
      throw new BadRequestException('El RUT es requerido');
    }

    try {
      const usuario = await this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoin('usuario.comuna', 'comuna')
        .leftJoin('usuario.perfil', 'perfil')
        .leftJoin('usuario.preferencias', 'preferencias')
        .select([
          'usuario.rutUsuario',
          'usuario.nombres',
          'usuario.apellidos',
          'usuario.email',
          'usuario.clave',
          'usuario.telefono',
          'usuario.direccion',
          'usuario.codigoPostal',
          'comuna.id',
          'perfil.id',
          'preferencias.respuesta1',
          'preferencias.respuesta2',
          'preferencias.respuesta3',
          'preferencias.respuesta4',
          'preferencias.respuesta5',
          'preferencias.respuesta6',
          'preferencias.respuesta7',
          'preferencias.respuesta8',
          'preferencias.respuesta9',
        ])
        .where('usuario.rutUsuario = :rut', { rut })
        .getOne();

      if (!usuario) {
        throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
      }

      const response = {
        rutUsuario: usuario.rutUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        clave: usuario.clave,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        codigoPostal: usuario.codigoPostal,
        idComuna: usuario.comuna?.id,
        idPerfil: usuario.perfil?.id,
        respuesta1: usuario.Preferencias?.respuesta1,
        respuesta2: usuario.Preferencias?.respuesta2,
        respuesta3: usuario.Preferencias?.respuesta3,
        respuesta4: usuario.Preferencias?.respuesta4,
        respuesta5: usuario.Preferencias?.respuesta5,
        respuesta6: usuario.Preferencias?.respuesta6,
        respuesta7: usuario.Preferencias?.respuesta7,
        respuesta8: usuario.Preferencias?.respuesta8,
        respuesta9: usuario.Preferencias?.respuesta9,
      };
      const usuarioResponse = new Usuario();
      Object.assign(usuarioResponse, response);

      this.logger.log(`Usuario encontrado exitosamente con RUT: ${rut}`);
      return usuarioResponse;
    } catch (error) {
      this.logger.error(`Error al buscar usuario por RUT: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
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
      // Buscar usuario por RUT o ID
      if (isNaN(Number(identificador))) {
        this.logger.debug(`Buscando usuario por RUT: ${identificador}`);
        usuario = await this.findUsuarioByRut(identificador);
      } else {
        this.logger.debug(`Buscando usuario por ID: ${identificador}`);
        usuario = await this.findOne(Number(identificador));
      }

      // Validar si hay cambios en el email
      if (updateUsuarioDto.email && updateUsuarioDto.email !== usuario.email) {
        const emailExistente = await this.usuarioRepository.findOne({
          where: {
            email: updateUsuarioDto.email,
            id: Not(usuario.id), // Excluir el usuario actual de la búsqueda
          },
        });
        if (emailExistente) {
          this.logger.warn(`Email ${updateUsuarioDto.email} ya está en uso`);
          throw new BadRequestException(
            `El email ${updateUsuarioDto.email} ya está registrado`,
          );
        }
      }

      // Validar y actualizar comuna si se proporciona
      if (updateUsuarioDto.idComuna) {
        const comuna = await this.comunaRepository.findOneBy({
          id: updateUsuarioDto.idComuna,
        });
        if (!comuna) {
          throw new NotFoundException(
            `Comuna con ID ${updateUsuarioDto.idComuna} no encontrada`,
          );
        }
        usuario.comuna = comuna;
      }

      // Validar y actualizar perfil si se proporciona
      if (updateUsuarioDto.idPerfil) {
        const perfil = await this.perfilRepository.findOneBy({
          id: updateUsuarioDto.idPerfil,
        });
        if (!perfil) {
          throw new NotFoundException(
            `Perfil con ID ${updateUsuarioDto.idPerfil} no encontrado`,
          );
        }
        usuario.perfil = perfil;
      }

      // Actualizar usuario usando transacción
      const usuarioActualizado =
        await this.usuarioRepository.manager.transaction(
          async (transactionalEntityManager) => {
            // Actualizar datos del usuario
            Object.assign(usuario, updateUsuarioDto);

            // Si hay preferencias para actualizar
            if (
              usuario.Preferencias &&
              (updateUsuarioDto.respuesta1 !== undefined ||
                updateUsuarioDto.respuesta2 !== undefined ||
                updateUsuarioDto.respuesta3 !== undefined ||
                updateUsuarioDto.respuesta4 !== undefined ||
                updateUsuarioDto.respuesta5 !== undefined ||
                updateUsuarioDto.respuesta6 !== undefined ||
                updateUsuarioDto.respuesta7 !== undefined ||
                updateUsuarioDto.respuesta8 !== undefined ||
                updateUsuarioDto.respuesta9 !== undefined)
            ) {
              const preferencias = await this.preferenciasRepository.findOne({
                where: { usuario: { id: usuario.id } },
              });

              if (preferencias) {
                Object.assign(preferencias, {
                  respuesta1:
                    updateUsuarioDto.respuesta1 ?? preferencias.respuesta1,
                  respuesta2:
                    updateUsuarioDto.respuesta2 ?? preferencias.respuesta2,
                  respuesta3:
                    updateUsuarioDto.respuesta3 ?? preferencias.respuesta3,
                  respuesta4:
                    updateUsuarioDto.respuesta4 ?? preferencias.respuesta4,
                  respuesta5:
                    updateUsuarioDto.respuesta5 ?? preferencias.respuesta5,
                  respuesta6:
                    updateUsuarioDto.respuesta6 ?? preferencias.respuesta6,
                  respuesta7:
                    updateUsuarioDto.respuesta7 ?? preferencias.respuesta7,
                  respuesta8:
                    updateUsuarioDto.respuesta8 ?? preferencias.respuesta8,
                  respuesta9:
                    updateUsuarioDto.respuesta9 ?? preferencias.respuesta9,
                });
                await transactionalEntityManager.save(
                  Preferencias,
                  preferencias,
                );
              }
            }

            const savedUsuario = await transactionalEntityManager.save(
              Usuario,
              usuario,
            );
            this.logger.log(
              `Usuario actualizado exitosamente: ${identificador}`,
            );

            return savedUsuario;
          },
        );

      return usuarioActualizado;
    } catch (error) {
      this.logger.error(
        `Error al actualizar usuario: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al actualizar el usuario: ${error.message}`,
      );
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
      // Verificar si el perfil existe
      const perfilExistente = await this.findOnePerfil(id);

      // Validar si es perfil ADMIN
      if (perfilExistente.nombrePerfil === NombrePerfil.ADMIN) {
        this.logger.warn(`Intento de modificar perfil ADMIN rechazado`);
        throw new BadRequestException(
          'No se puede modificar el perfil de administrador',
        );
      }

      // Validar nombre de perfil único si se está actualizando
      if (updatePerfilDto.nombrePerfil) {
        const perfilDuplicado = await this.perfilRepository.findOne({
          where: {
            nombrePerfil: updatePerfilDto.nombrePerfil,
            id: Not(id),
          },
        });

        if (perfilDuplicado) {
          this.logger.warn(
            `Nombre de perfil duplicado: ${updatePerfilDto.nombrePerfil}`,
          );
          throw new BadRequestException(
            `Ya existe un perfil con el nombre ${updatePerfilDto.nombrePerfil}`,
          );
        }
      }

      // Actualizar perfil usando transacción
      const perfilActualizado = await this.perfilRepository.manager.transaction(
        async (transactionalEntityManager) => {
          Object.assign(perfilExistente, updatePerfilDto);

          const savedPerfil = await transactionalEntityManager.save(
            Perfil,
            perfilExistente,
          );
          this.logger.log(`Perfil actualizado exitosamente: ${id}`);

          return savedPerfil;
        },
      );

      return perfilActualizado;
    } catch (error) {
      this.logger.error(
        `Error al actualizar perfil: ${error.message}`,
        error.stack,
      );

      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Error al actualizar el perfil: ${error.message}`,
      );
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

  async findByIdOrRut(identificador: string | number): Promise<any> {
    this.logger.log(`Buscando usuario con identificador: ${identificador}`);

    try {
      const query = this.usuarioRepository
        .createQueryBuilder('usuario')
        .leftJoinAndSelect('usuario.comuna', 'comuna')
        .leftJoinAndSelect('usuario.perfil', 'perfil')
        .leftJoinAndSelect('usuario.Preferencias', 'preferencias');

      if (typeof identificador === 'number' || !isNaN(Number(identificador))) {
        query.where('usuario.id = :identificador', {
          identificador: Number(identificador),
        });
      } else {
        query.where('usuario.rutUsuario = :identificador', { identificador });
      }

      const usuario = await query.getOne();

      if (!usuario) {
        throw new NotFoundException(
          `Usuario no encontrado con identificador: ${identificador}`,
        );
      }
      const resUsuario: UsuarioResponseDto = {
        rutUsuario: usuario.rutUsuario,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        email: usuario.email,
        clave: usuario.clave,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        idComuna: usuario.comuna?.id,
        codigoPostal: usuario.codigoPostal,
        idPerfil: usuario.perfil?.id,
        respuesta1: usuario.Preferencias[0]?.respuesta1,
        respuesta2: usuario.Preferencias[0]?.respuesta2,
        respuesta3: usuario.Preferencias[0]?.respuesta3,
        respuesta4: usuario.Preferencias[0]?.respuesta4,
        respuesta5: usuario.Preferencias[0]?.respuesta5,
        respuesta6: usuario.Preferencias[0]?.respuesta6,
        respuesta7: usuario.Preferencias[0]?.respuesta7,
        respuesta8: usuario.Preferencias[0]?.respuesta8,
        respuesta9: usuario.Preferencias[0]?.respuesta9,
      };
      return resUsuario;
    } catch (error) {
      this.logger.error(`Error al buscar usuario: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario');
    }
  }
}
