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
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
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
import { Logger } from '@nestjs/common';
import { BuscarJardinQueryDto } from '../dto/buscarJardin.dto';
@ApiTags('usuarios')
@Controller('usuarios')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsuariosController {
  perfilRepository: any;
  constructor(private readonly usuariosService: UsuariosService) {}
  /*  @ApiQuery({
    name: 'idUsuario',
    required: true,
    type: Number,
    description: 'El ID usuario para buscar su historial.',
  })
  @Get('/myjardinvirtual/')
  async buscarJardin(@Query() query: any) {
    const { idUsuario } = query;
    if (!idUsuario) {
      throw new Error('idUsuario es requerido');
    }
    console.log(`Buscando jardín para el usuario con idUsuario: ${idUsuario}`);
    const jardinVirtuual = await this.usuariosService.miJardin(idUsuario);
    return jardinVirtuual;
  }*/
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
  @Post('perfil/create')
  @ApiOperation({
    summary: 'Crear un nuevo perfil',
    description: 'Crea un nuevo perfil en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Perfil creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreatePerfilDto })
  async createPerfil(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createPerfilDto: CreatePerfilDto,
    @Res() res: Response,
  ) {
    try {
      const perfil = await this.usuariosService.createPerfil(createPerfilDto);
      res.status(HttpStatus.CREATED).json(perfil);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear el perfil.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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

  @Put('perfil/update/:id')
  @ApiOperation({
    summary: 'Actualizar un perfil',
    description: 'Actualiza los detalles de un perfil existente',
  })
  @ApiResponse({ status: 200, description: 'Perfil actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Perfil no encontrado.' })
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

  /************************************ */

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
  @UsePipes(ValidaForamteEmailPipe) // Aplicar el Pipe de validación
  async findPasswordByEmail(
    @Param('email') email: string,
    @Res() res: Response,
  ) {
    {
      try {
        let usuario = await this.usuariosService.findPasswordByEmail(email);

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
