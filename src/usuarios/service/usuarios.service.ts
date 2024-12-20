import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  HttpStatus,
  HttpException,
  UnauthorizedException,
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
import { ApiBearerAuth } from '@nestjs/swagger';
import { CredencialesDto } from '../dto/credenciales.dto';
import { JwtDto } from 'src/jwt/jwt.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comuna)
    private readonly comunaRepository: Repository<Comuna>,
    @InjectRepository(Perfil)
    private readonly perfilRepository: Repository<Perfil>,
    private readonly jwtService: JwtService,
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

    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(createUsuarioDto.clave, saltRounds);

    const nuevoUsuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      clave: hashedPassword, 
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
      return await this.perfilRepository.save(nuevoPerfil);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('El perfil ya existe.');
      }
      throw new BadRequestException('Error al crear el perfil', error);
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

  @ApiBearerAuth()
  async login(credencialesDto:CredencialesDto):Promise<JwtDto>{
    console.log("entré")
    console.log('JWT_SECRET:', process.env.JWT_SECRET); 
    console.log(credencialesDto.email)
    const usuario = await this.usuarioRepository.findOne({
      where: { email: credencialesDto.email },
      relations: ['perfil'],
    });
    console.log("usuario",usuario)
    if(!usuario){
    throw new UnauthorizedException("el usuario o la contraseña no es válido")
    }
  
    const contrasena = await bcrypt.compare(credencialesDto.password,usuario.clave)
    console.log("la pass que se le pasa: "+credencialesDto.password)
    console.log("la pass que encontro en la base: "+usuario.clave)
    console.log(contrasena);
    console.log(usuario)
  
   
    if(!contrasena){
        throw new UnauthorizedException("el usuario o la contraseña no es válido")
    }
   console.log(usuario.email)
  
   
   const payload = {
    email: usuario.email,
    perfil: usuario.perfil.nombrePerfil, 
  };

 
  const jwt = new JwtDto();


  try {
    // Generar el token utilizando la configuración global de JwtService
    
    const token = this.jwtService.sign(payload);
  
    jwt.token = token;

    console.log("Login exitoso");
    console.log(usuario);
    console.log("Token generado:", jwt.token);


  } catch (error) {
    console.error('Error al generar el JWT:', error);
    throw new HttpException('Error al generar el token', HttpStatus.INTERNAL_SERVER_ERROR);
  }

  return jwt; 
}
}
