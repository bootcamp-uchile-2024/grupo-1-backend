import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Res,
  HttpStatus,
  HttpException,
  NotFoundException,
  Put,
  BadRequestException,
  InternalServerErrorException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UsuariosService } from '../service/usuarios.service';
import { CreateUsuarioDto } from '../dto/create-usuario.dto';
import { Response } from 'express';
import { UpdateUsuarioDto } from '../dto/update-usuario.dto';
import { Usuario } from '../entities/usuario.entity';
import { Perfil } from '../entities/perfil.entity';
import { UpdatePerfilDto } from '../dto/update-perfil.dto';
import { CreatePerfilDto } from '../dto/create-perfil.dto';
import { ValidaForamteEmailPipe } from 'src/comunes/pipes/validaFormatoEmail.pipe';
import { RolesAutorizados } from 'src/comunes/decorator/rol.decorator';
import { Rol } from 'src/enum/rol.enum';
import { CredencialesDto } from '../dto/credenciales.dto';
import { JwtDto } from 'src/jwt/jwt.dto';
import * as bcrypt from 'bcryptjs';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { UpdatePasswordDto } from '../dto/update-password.dto';

@Controller('usuarios')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsuariosController {
  private readonly logger = new Logger(UsuariosController.name);

  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiTags('Gestion - Customer')
  @ApiOperation({
    summary: 'Iniciar sesión',
    description: 'Permite a un usuario registrado iniciar sesión en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Inicio de sesión exitoso',
    type: JwtDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  @ApiBody({ type: CredencialesDto })
  @Post('login')
  async login(@Body() credencialesDto: CredencialesDto): Promise<JwtDto> {
    this.logger.verbose(
      `Intento de login para usuario: ${credencialesDto.email}`,
    );
    try {
      const result = await this.usuariosService.login(credencialesDto);
      this.logger.log(`Login exitoso para usuario: ${credencialesDto.email}`);
      return result;
    } catch (error) {
      this.logger.error(`Error en login: ${error.message}`);
      throw error;
    }
  }

  @ApiTags('Gestion - Customer')
  @Post('gestion/insert')
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un nuevo usuario en el sistema para asociar sus compras y notificaciones',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiResponse({ status: 409, description: 'Usuario ya existe.' })
  @ApiBody({ type: CreateUsuarioDto })
  async create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUsuarioDto,
  ) {
    this.logger.log(
      `Iniciando creación de usuario: ${createUserDto.rutUsuario}`,
    );
    try {
      const usuario = await this.usuariosService.create(createUserDto);
      this.logger.log(`Usuario creado exitosamente: ${usuario.rutUsuario}`);
      return usuario;
    } catch (error) {
      this.logger.error(`Error al crear usuario: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el usuario.');
    }
  }

  @ApiTags('Gestion - Customer')
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @Get('/gestion/list')
  @ApiOperation({
    summary: 'Obtener la lista de usuarios',
    description: 'Obtiene la lista de todos los usuarios registrados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida con éxito.',
  })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async findAll() {
    this.logger.log('Consultando lista de usuarios');

    try {
      const usuarios = await this.usuariosService.findAll();
      this.logger.log(`Se encontraron ${usuarios.length} usuarios`);
      return usuarios;
    } catch (error) {
      this.logger.error(`Error al obtener usuarios: ${error.message}`);
      throw new InternalServerErrorException(
        'Error al obtener la lista de usuarios.',
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @ApiTags('Gestion - Customer')
  //@RolesAutorizados(Rol.ADMIN)
  @Get('/gestion/listbyrut/:identificador')
  @ApiOperation({
    summary: 'Obtener un usuario por ID o RUT',
    description:
      'Devuelve los detalles de un usuario específico por su ID o RUT',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles del usuario encontrado',
    type: Usuario,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  @ApiParam({
    name: 'identificador',
    description: 'ID o RUT del usuario',
    required: true,
  })
  async findByIdOrRut(@Param('identificador') identificador: string) {
    this.logger.log(`Buscando usuario con identificador: ${identificador}`);
    try {
      const usuario = await this.usuariosService.findByIdOrRut(identificador);
      return {
        statusCode: HttpStatus.OK,
        message: 'Usuario encontrado exitosamente',
        responseData: usuario,
      };
    } catch (error) {
      this.logger.error(`Error al buscar usuario: ${error.message}`);
      throw error;
    }
  }

  @ApiTags('Gestion - Customer')
  //@RolesAutorizados(Rol.ADMIN)
  @Delete('/gestion/delete/:identificador')
  @ApiOperation({ summary: 'Eliminar un usuario por ID o RUT' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito.' })
  @ApiResponse({
    status: 400,
    description:
      'No se puede eliminar el usuario porque tiene registros relacionados.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async remove(@Param('identificador') identificador: string) {
    this.logger.log(`Iniciando eliminación de usuario: ${identificador}`);
    try {
      await this.usuariosService.remove(identificador);
      this.logger.log(`Usuario eliminado exitosamente: ${identificador}`);
      return {
        statusCode: HttpStatus.OK,
        message: 'Usuario eliminado con éxito.',
        data: identificador,
      };
    } catch (error) {
      this.logger.error(`Error al eliminar usuario: ${error.message}`);

      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          error: 'Not Found',
        });
      }

      if (error instanceof BadRequestException) {
        throw new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          error: 'Bad Request',
        });
      }

      throw new InternalServerErrorException({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error interno del servidor al eliminar el usuario.',
        error: 'Internal Server Error',
      });
    }
  }
  @ApiTags('Gestion - Customer')
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @Put('/gestion/update/:identificador')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza los detalles de un usuario existente',
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiParam({
    name: 'identificador',
    description: 'ID o RUT del usuario',
    required: true,
  })
  async updateUsuario(
    @Param('identificador') identificador: string,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUsuarioDto: UpdateUsuarioDto,
    @Res() res: Response,
  ) {
    try {
      await this.usuariosService.findByIdOrRut(identificador);

      const usuario = await this.usuariosService.updateUsuario(
        identificador,
        updateUsuarioDto,
      );

      return res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Usuario actualizado exitosamente',
        responseData: usuario,
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          timestamp: new Date().toISOString(),
          path: `/usuarios/gestion/update/${identificador}`,
        });
      } else if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          timestamp: new Date().toISOString(),
          path: `/usuarios/gestion/update/${identificador}`,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error interno del servidor.',
          timestamp: new Date().toISOString(),
          path: `/usuarios/gestion/update/${identificador}`,
        });
      }
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @ApiTags('Gestion-Perfiles')
  @Post('perfil/create')
  @ApiOperation({
    summary: 'Crear un nuevo perfil',
    description: 'Crea un nuevo perfil en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Perfil creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiBody({ type: CreatePerfilDto })
  async createPerfil(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createPerfilDto: CreatePerfilDto,
  ): Promise<Perfil> {
    this.logger.log(
      `Iniciando creación de perfil: ${createPerfilDto.nombrePerfil}`,
    );
    try {
      const perfil = await this.usuariosService.createPerfil(createPerfilDto);
      this.logger.log(`Perfil creado exitosamente: ${perfil.nombrePerfil}`);
      return perfil;
    } catch (error) {
      this.logger.error(`Error al crear perfil: ${error.message}`);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear el perfil.');
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @ApiTags('Gestion-Perfiles')
  @Get('perfil/get')
  @ApiOperation({ summary: 'Obtener todos los perfiles' })
  @ApiResponse({
    status: 200,
    description: 'Lista de perfiles obtenida con éxito.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @ApiResponse({ status: 404, description: 'Perfiles no encontrados.' })
  async findAllPerfil(@Res() res: Response) {
    try {
      const perfiles = await this.usuariosService.findAllPerfil();
      res.status(HttpStatus.OK).json(perfiles);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los perfiles.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @ApiTags('Gestion-Perfiles')
  @Get('perfil/getbyid/:id')
  @ApiOperation({
    summary: 'Obtener un perfil por ID',
    description: 'Devuelve los detalles de un perfil específico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del perfil encontrado',
    type: Perfil,
  })
  @ApiResponse({
    status: 404,
    description: 'Perfil no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del perfil',
    required: true,
  })
  async findOnePerfil(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const perfil = await this.usuariosService.findOnePerfil(id);
      if (!perfil) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Perfil no encontrado' });
      }
      res.status(HttpStatus.OK).json(perfil);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al obtener el perfil.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
  @ApiTags('Gestion-Perfiles')
  @Put('perfil/update/:id')
  @ApiOperation({
    summary: 'Actualizar un perfil',
    description: 'Actualiza los detalles de un perfil existente',
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiBody({ type: UpdatePerfilDto })
  @ApiParam({ name: 'id', description: 'ID del perfil', required: true })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePerfilDto: UpdatePerfilDto,
    @Res() res: Response,
  ) {
    this.logger.verbose(`Iniciando actualización de perfil ID: ${id}`);
    try {
      const perfil = await this.usuariosService.updatePerfil(
        id,
        updatePerfilDto,
      );
      this.logger.log(`Perfil ${id} actualizado exitosamente`);
      res.status(HttpStatus.OK).json(perfil);
    } catch (error) {
      this.logger.error(`Error al actualizar perfil ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al actualizar el perfil.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @ApiTags('Gestion-Perfiles')
  //@RolesAutorizados(Rol.ADMIN)
  @Delete('perfil/delete/:id')
  @ApiParam({
    name: 'id',
    description: 'ID del perfil a eliminar',
    required: true,
    schema: { type: 'integer' },
  })
  @ApiOperation({ summary: 'Eliminar un perfil' })
  @ApiResponse({ status: 200, description: 'Perfil eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async deletePerfil(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    this.logger.verbose(`Iniciando eliminación de perfil ID: ${id}`);
    try {
      await this.usuariosService.deletePerfil(id);
      this.logger.log(`Perfil ${id} eliminado exitosamente`);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Perfil eliminado con éxito.' });
    } catch (error) {
      this.logger.error(`Error al eliminar perfil ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al eliminar el perfil.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @ApiTags('Gestion - Customer')
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN, Rol.USUARIO)
  @Get('findPasswordByEmail/:email')
  @ApiOperation({
    summary: 'HU010-Recuperar Clave por Email',
    description:
      'Devuelve clave usuario registrado de un usuario específico por su email',
  })
  @ApiResponse({
    status: 200,
    description: 'Clave recuperada',
    type: Usuario,
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario no encontrado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  @ApiParam({
    name: 'email',
    description: 'email',
    required: true,
  })
  @UsePipes(ValidaForamteEmailPipe)
  async findPasswordByEmail(
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    this.logger.verbose(
      `Iniciando recuperación de contraseña para email: ${email}`,
    );
    try {
      const usuario = await this.usuariosService.findPasswordByEmail(email);
      if (!usuario) {
        this.logger.warn(`No se encontró usuario con email: ${email}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuario no encontrado' });
      }
      this.logger.log(
        `Contraseña recuperada exitosamente para email: ${email}`,
      );
      res.status(HttpStatus.OK).json(usuario.clave);
    } catch (error) {
      this.logger.error(
        `Error al recuperar contraseña para email ${email}: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al obtener el usuario.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @ApiTags('Gestion - Customer')
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN, Rol.USUARIO)
  @Put('/gestion/update-password/:identificador')
  @ApiOperation({
    summary: 'Actualizar contraseña de usuario',
    description: 'Actualiza la contraseña de un usuario existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Contraseña actualizada con éxito.',
  })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiParam({
    name: 'identificador',
    description: 'ID o RUT del usuario',
    required: true,
  })
  async updatePassword(
    @Param('identificador') identificador: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.logger.verbose(
      `Iniciando actualización de contraseña para usuario: ${identificador}`,
    );
    try {
      await this.usuariosService.updatePassword(
        identificador,
        updatePasswordDto,
      );
      this.logger.log(
        `Contraseña actualizada exitosamente para usuario: ${identificador}`,
      );
      return {
        statusCode: HttpStatus.OK,
        message: 'Contraseña actualizada exitosamente',
      };
    } catch (error) {
      this.logger.error(
        `Error al actualizar contraseña para usuario ${identificador}: ${error.message}`,
      );
      throw error;
    }
  }
}
