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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
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

@Controller('usuarios')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsuariosController {
  perfilRepository: any;
  constructor(private readonly usuariosService: UsuariosService) {}

  @ApiTags('Gestion - Customer')
  @RolesAutorizados(Rol.INVITADO)
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
    @Res() res: Response,
  ) {
    try {
      const usuario = await this.usuariosService.create(createUserDto);
      res.status(HttpStatus.CREATED).json(usuario);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear el usuario.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiTags('Gestion - Customer')
  @RolesAutorizados(Rol.ADMIN)
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
  async findAll(@Res() res: Response) {
    try {
      const usuarios = await this.usuariosService.findAll();
      res.status(HttpStatus.OK).json(usuarios);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Error al obtener la lista de usuarios.',
      });
    }
  }

  @ApiTags('Gestion - Customer')
  @RolesAutorizados(Rol.ADMIN)
  @Get('/gestion/listbyrut/:identifier')
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
    name: 'identifier',
    description: 'ID o RUT del usuario',
    required: true,
  })
  async findOne(@Param('identifier') identifier: string) {
    if (!identifier) {
      throw new BadRequestException('Identificador no proporcionado');
    }

    try {
      const usuario = isNaN(Number(identifier))
        ? await this.usuariosService.findUsuarioByRut(identifier)
        : await this.usuariosService.findOne(Number(identifier));

      return usuario;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }

      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }

      throw new InternalServerErrorException(
        'Error interno del servidor al obtener el usuario.',
      );
    }
  }
  @ApiTags('Gestion - Customer')
  @RolesAutorizados(Rol.ADMIN)
  @Delete('/gestion/delete/:identificador')
  @ApiParam({
    name: 'identificador',
    description: 'ID o Rut del usuario a eliminar',
    required: true,
    schema: { type: 'string' },
  })
  @ApiOperation({ summary: 'Eliminar un usuario por ID o RUT' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario eliminado con éxito.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuario no encontrado.',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor.',
  })
  async remove(
    @Param('identificador') identificador: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      await this.usuariosService.remove(identificador);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Usuario eliminado con éxito.', data: identificador });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: error.message,
          timestamp: new Date().toISOString(),
          path: `/usuarios/gestion/delete/${identificador}`,
        });
      } else if (error instanceof BadRequestException) {
        res.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: error.message,
          timestamp: new Date().toISOString(),
          path: `/usuarios/gestion/delete/${identificador}`,
        });
      } else {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Error interno del servidor.',
          timestamp: new Date().toISOString(),
          path: `/usuarios/gestion/delete/${identificador}`,
        });
      }
    }
  }
  @ApiTags('Gestion - Customer')
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
      const usuario = await this.usuariosService.updateUsuario(
        identificador,
        updateUsuarioDto,
      );
      res.status(HttpStatus.OK).json(usuario);
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
  @ApiTags('Gestion-Perfiles')
  @RolesAutorizados(Rol.ADMIN)
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
    try {
      return await this.usuariosService.createPerfil(createPerfilDto);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear el perfil.',
          data: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiTags('Gestion-Perfiles')
  @RolesAutorizados(Rol.ADMIN)
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

  @ApiTags('Gestion-Perfiles')
  @RolesAutorizados(Rol.ADMIN)
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

  @ApiTags('Gestion-Perfiles')
  @RolesAutorizados(Rol.ADMIN)
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
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updatePerfilDto: UpdatePerfilDto,
    @Res() res: Response,
  ) {
    try {
      const perfil = await this.usuariosService.updatePerfil(
        id,
        updatePerfilDto,
      );
      res.status(HttpStatus.OK).json(perfil);
    } catch (error) {
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
  @RolesAutorizados(Rol.ADMIN)
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
    try {
      await this.usuariosService.deletePerfil(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Perfil eliminado con éxito.' });
    } catch (error) {
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
  @RolesAutorizados(Rol.INVITADO)
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
    {
      try {
        const usuario = await this.usuariosService.findPasswordByEmail(email);

        if (!usuario) {
          return res
            .status(HttpStatus.NOT_FOUND)
            .json({ message: 'Usuario no encontrado' });
        }

        res.status(HttpStatus.OK).json(usuario.clave);
      } catch (error) {
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
  }
}
