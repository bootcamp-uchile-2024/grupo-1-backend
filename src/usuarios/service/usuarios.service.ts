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
import { Perfil } from '../entities/perfil.entity';
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
    // Verificar si el RUT ya existe
    const usuarioExistentePorRut = await this.usuarioRepository.findOneBy({
      rutUsuario: createUsuarioDto.rutUsuario,
    });
    if (usuarioExistentePorRut) {
      throw new ConflictException(
        `El RUT ${createUsuarioDto.rutUsuario} ya está registrado`,
      );
    }

    // Verificar si el correo electrónico ya existe
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
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }
  async findOneOC(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      return null;
    }
    return usuario;
  }
  async remove(id: number): Promise<void> {
    const result = await this.usuarioRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }
  async findUsuarioByRut(rut: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ rutUsuario: rut });
    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }
    return usuario;
  }
  async updateUsuario(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(usuario);
  }
  async createPerfil(createPerfilDto: CreatePerfilDto): Promise<Perfil> {
    const nuevoPerfil = this.perfilRepository.create(createPerfilDto);
    return await this.perfilRepository.save(nuevoPerfil);
  }

  async findAllPerfil(): Promise<Perfil[]> {
    return await this.perfilRepository.find();
  }

  async findOnePerfil(id: number): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOneBy({ id });
    if (!perfil) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
    return perfil;
  }

  async updatePerfil(
    id: number,
    updatePerfilDto: UpdatePerfilDto,
  ): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOneBy({ id });
    if (!perfil) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }

    Object.assign(perfil, updatePerfilDto);
    return await this.perfilRepository.save(perfil);
  }

  async deletePerfil(id: number): Promise<void> {
    const perfil = await this.perfilRepository.findOne({
      where: { id },
      relations: ['usuarios'],
    });

    if (!perfil) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }

    if (perfil.accesoSistema) {
      throw new BadRequestException(
        `No se puede eliminar el perfil con ID ${id} porque tiene acceso al sistema`,
      );
    }

    if (perfil.descripcion === 'Administrador') {
      throw new BadRequestException(
        `No se puede eliminar el perfil con ID ${id} porque es el perfil de Administrador`,
      );
    }

    const usuariosAsociados = await this.usuarioRepository.find({
      where: { perfil: { id } },
    });

    if (usuariosAsociados.length > 0) {
      throw new BadRequestException(
        `No se puede eliminar el perfil con ID ${id} porque tiene usuarios asociados`,
      );
    }

    const result = await this.perfilRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Perfil con ID ${id} no encontrado`);
    }
  }

  async findPasswordByEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOneBy({
      email: email,
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }
    return usuario;
  }
}
