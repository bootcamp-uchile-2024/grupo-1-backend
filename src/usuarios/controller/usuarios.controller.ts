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
  BadRequestException,
  Put,
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

@ApiTags('usuarios')
@Controller('usuarios')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description:
      'Crea un nuevo usuario en el sistema para asociar sus compras y notificaciones',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
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

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida con éxito.',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  async findAll(@Res() res: Response) {
    try {
      const usuarios = await this.usuariosService.findAll();
      res.status(HttpStatus.OK).json(usuarios);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los usuarios.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':identifier')
  @ApiOperation({
    summary: 'Obtener un usuario por ID o RUT',
    description:
      'Devuelve los detalles de un usuario específico por su ID o RUT',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del usuario encontrado',
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
    name: 'identifier',
    description: 'ID o RUT del usuario',
    required: true,
  })
  async findOne(@Param('identifier') identifier: string, @Res() res: Response) {
    try {
      let usuario;
      if (isNaN(Number(identifier))) {
        // Buscar por RUT
        usuario = await this.usuariosService.findUsuarioByRut(identifier);
      } else {
        // Buscar por ID
        usuario = await this.usuariosService.findOne(Number(identifier));
      }

      if (!usuario) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuario no encontrado' });
      }

      res.status(HttpStatus.OK).json(usuario);
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

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    required: true,
    schema: { type: 'integer' },
  })
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del usuario a eliminar',
    required: true,
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      await this.usuariosService.remove(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Usuario eliminado con éxito.' });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Usuario no encontrado.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al eliminar el usuario.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar un usuario',
    description: 'Actualiza los detalles de un usuario existente',
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiBody({ type: UpdateUsuarioDto })
  @ApiParam({ name: 'id', description: 'ID del usuario', required: true })
  async updateUsuario(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateUsuarioDto: UpdateUsuarioDto,
    @Res() res: Response,
  ) {
    try {
      const usuario = await this.usuariosService.updateUsuario(
        id,
        updateUsuarioDto,
      );
      res.status(HttpStatus.OK).json(usuario);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error: 'Datos inválidos.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
