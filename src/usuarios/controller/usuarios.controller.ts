import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ValidationPipe,
  UsePipes,
  Res,
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
  constructor(private readonly usuariosService: UsuariosService) {}
  @Post()
  @ApiOperation({
    summary: 'Historia Usuario H008: Crea nuevo usuario',
    description: 'Crea usuario dentro de sistema para poder asociar sus compras para notificaciones',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateUsuarioDto })
  create(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createUserDto: CreateUsuarioDto,
    @Res() res: Response) {
      res.status(501).send('No implementado');
  }
  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida con éxito.',
  })
  findAll(@Res() res: Response) {
    res.status(501).send('No implementado');
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
  findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    res.status(501).send('No implementado');
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
  remove(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    res.status(501).send('No implementado');
  }
}
