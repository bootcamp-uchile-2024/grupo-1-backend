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

@ApiTags('usuarios')
@Controller('usuarios')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post()
  @ApiOperation({
    summary: 'Historia Usuario H008: Crea nuevo usuario',
    description:
      'Crea usuario dentro de sistema para poder asociar sus compras para notificaciones',
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
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Datos inválidos.',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida con éxito.',
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

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'id del usuario a obtener',
    required: true,
    schema: { type: 'integer' },
  })
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const usuario = await this.usuariosService.findOne(id);
      if (!usuario) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Usuario no encontrado.' });
      } else {
        res.status(HttpStatus.OK).json(usuario);
      }
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el usuario.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'id del usuario a eliminar',
    required: true,
    schema: { type: 'integer' },
  })
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  async remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    return null;
  }
}
