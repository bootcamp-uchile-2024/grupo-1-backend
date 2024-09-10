import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Response } from 'express';
import { VerUsuarioDto } from './dto/Ver-Usuario-Dto';


@ApiTags('usuarios')
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener todos los usuarios' })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuarios obtenida con éxito.',
    type: VerUsuarioDto,
    isArray: true,
  })
  findAll(@Res() res: Response) {
    const usuarios = this.usuariosService.findAll();
    const usuarioDtos = usuarios.map(usuario => new VerUsuarioDto(usuario.nombre,usuario.email,usuario.plantas));

    res.status(200).send(usuarioDtos);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id') id: string,@Res() res:Response) {
    // lógica para obtener un usuario por ID
    const resultado=this.usuariosService.findOne(+id);
    if(resultado){
      res.status(201).send(resultado)
    }else{
      res.status(404).send({message:'Usuario no encontrado'})
    }


  }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateUsuarioDto })
  create(@Body(new ValidationPipe()) createUsuarioDto: CreateUsuarioDto, @Res() res: Response) {
    const newUsuario = this.usuariosService.create(createUsuarioDto);
    res.status(201).send(newUsuario);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un usuario existente' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  @ApiBody({ type: UpdateUsuarioDto })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    // lógica para actualizar un usuario existente
    this.usuariosService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  remove(@Param('id') id: string) {
    // lógica para eliminar un usuario
    this.usuariosService.remove(+id);
  }
}
