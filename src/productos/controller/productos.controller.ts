import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  Query,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Delete,
  NotFoundException,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ProductosService } from '../service/productos.service';
import { CreatePlantaDto } from '../dto/create-planta.dto';
import { CreateCategoriaDto } from '../dto/create-categoria.dto';
import { UpdateCategoriaDto } from '../dto/update-categoria.dto';
import { CreateProductoDto } from '../dto/create-producto.dto';
import { CreateMaceteroDto } from '../dto/create-macetero.dto';
import { UpdateMaceteroDto } from '../dto/update-macetero.dto';
import { CreateFertilizanteDto } from '../dto/create-fertilizante.dto';
import { Producto } from '../entities/producto.entity';
import { Categoria } from '../entities/categoria.entity';
import { UpdateFertilizanteDto } from '../dto/update-fertilizante.dto';
import { Fertilizante } from '../entities/fertilizante.entity';
import { Macetero } from '../entities/macetero.entity';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Get('catalogo')
  @ApiOperation({
    summary: 'Historia Usuario H004: Listado de Productos Plantopia',
    description:
      'Lista todos los productos del catalogo de plantopia sin filtros',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de todos los productos',
    type: [Producto],
  })
  async findAllCatalogo(@Res() res: Response) {
    try {
      const productos = await this.productosService.findallcatalogo();
      res.status(HttpStatus.OK).json(productos);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los productos.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener un producto por ID',
    description: 'Devuelve los detalles de un producto específico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del producto encontrado',
    type: Producto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'id del producto',
    required: true,
  })
  async findOne(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const producto = await this.productosService.porProducto(id);
      if (!producto) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Producto no encontrado' });
      }
      res.status(HttpStatus.OK).json(producto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el producto.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('planta')
  @ApiOperation({
    summary: 'Crear una nueva planta',
    description: 'Crea una nueva planta en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Planta creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreatePlantaDto })
  async createPlanta(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createPlantaDto: CreatePlantaDto,
    @Res() res: Response,
  ) {
    try {
      const planta = await this.productosService.createPlanta(createPlantaDto);
      res.status(HttpStatus.CREATED).json(planta);
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

  @Post('categoria')
  @ApiOperation({
    summary: 'Crear una nueva categoría',
    description: 'Crea una nueva categoría en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Categoría creada con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateCategoriaDto })
  async createCategoria(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createCategoriaDto: CreateCategoriaDto,
    @Res() res: Response,
  ) {
    try {
      const categoria =
        await this.productosService.createCategoria(createCategoriaDto);
      res.status(HttpStatus.CREATED).json(categoria);
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

  @Put('categoria/:id')
  @ApiOperation({
    summary: 'Actualizar una categoría',
    description: 'Actualiza los detalles de una categoría existente',
  })
  @ApiResponse({ status: 200, description: 'Categoría actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @ApiBody({ type: UpdateCategoriaDto })
  @ApiParam({ name: 'id', description: 'ID de la categoría', required: true })
  async updateCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateCategoriaDto: UpdateCategoriaDto,
    @Res() res: Response,
  ) {
    try {
      const categoria = await this.productosService.updateCategoria(
        id,
        updateCategoriaDto,
      );
      res.status(HttpStatus.OK).json(categoria);
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

  @Delete('categoria/:id')
  @ApiOperation({
    summary: 'Eliminar una categoría',
    description: 'Elimina una categoría existente por su ID',
  })
  @ApiResponse({ status: 200, description: 'Categoría eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
  @ApiParam({ name: 'id', description: 'ID de la categoría', required: true })
  async deleteCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.productosService.deleteCategoria(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Categoría eliminada con éxito.' });
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

  @Get('categorias/listado')
  @ApiOperation({
    summary: 'Listar todas las categorías',
    description: 'Devuelve una lista de todas las categorías',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de categorías obtenida con éxito.',
    type: [Categoria],
  })
  @ApiResponse({ status: 500, description: 'Error al obtener las categorías.' })
  async findAllCategorias(@Res() res: Response) {
    try {
      const categorias = await this.productosService.findAllCategorias();
      res.status(HttpStatus.OK).json(categorias);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener las categorías.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categoria/:id')
  @ApiOperation({
    summary: 'Obtener una categoría por ID',
    description: 'Devuelve los detalles de una categoría específica por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la categoría encontrada',
    type: Categoria,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiParam({ name: 'id', description: 'ID de la categoría', required: true })
  async findCategoriaById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const categoria = await this.productosService.findCategoriaById(id);
      if (!categoria) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Categoría no encontrada' });
      }
      res.status(HttpStatus.OK).json(categoria);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener la categoría.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('categoria/nombre/:nombrecategoria')
  @ApiOperation({
    summary: 'Obtener una categoría por nombre',
    description:
      'Devuelve los detalles de una categoría específica por su nombre',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la categoría encontrada',
    type: Categoria,
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría no encontrada',
  })
  @ApiParam({
    name: 'nombrecategoria',
    description: 'Nombre de la categoría',
    required: true,
  })
  async findCategoriaByNombre(
    @Param('nombrecategoria') nombrecategoria: string,
    @Res() res: Response,
  ) {
    try {
      const categoria =
        await this.productosService.findCategoriaIdByName(nombrecategoria);
      if (!categoria) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Categoría no encontrada' });
      }
      res.status(HttpStatus.OK).json(categoria);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener la categoría.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('crear/producto')
  @ApiOperation({
    summary: 'Crear un nuevo producto',
    description: 'Crea un nuevo producto en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Producto creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateProductoDto })
  async createProducto(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createProductoDto: CreateProductoDto,
    @Res() res: Response,
  ) {
    try {
      const producto =
        await this.productosService.createProducto(createProductoDto);
      res.status(HttpStatus.CREATED).json(producto);
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

  @Post('maceteros/create')
  @ApiOperation({
    summary: 'Crear un nuevo macetero',
    description: 'Crea un nuevo macetero en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Macetero creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateMaceteroDto })
  async createMacetero(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createMaceteroDto: CreateMaceteroDto,
    @Res() res: Response,
  ) {
    try {
      const macetero =
        await this.productosService.createMacetero(createMaceteroDto);
      res.status(HttpStatus.CREATED).json(macetero);
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

  @Get('maceteros/get')
  @ApiOperation({
    summary: 'Obtener maceteros paginados',
    description: 'Obtiene una lista de maceteros paginados',
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Maceteros obtenidos con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async getMaceterosPaginados(
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    try {
      const maceteros = await this.productosService.getMaceterosPaginados(
        page,
        size,
      );
      res.status(HttpStatus.OK).json(maceteros);
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
  @Get('maceteros/getbyid/:id')
  @ApiOperation({
    summary: 'Obtener un macetero por ID',
    description: 'Devuelve los detalles de un macetero específico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del macetero encontrado',
    type: Macetero,
  })
  @ApiResponse({
    status: 404,
    description: 'Macetero no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del macetero',
    required: true,
  })
  async findOneMacetero(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const macetero = await this.productosService.findMaceteroById(id);
      if (!macetero) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Macetero no encontrado' });
      }
      res.status(HttpStatus.OK).json(macetero);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el macetero.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete('maceteros/delete/:id')
  @ApiOperation({
    summary: 'Eliminar un macetero',
    description: 'Elimina un macetero existente por su ID',
  })
  @ApiResponse({ status: 200, description: 'Macetero eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Macetero no encontrado.' })
  @ApiParam({ name: 'id', description: 'ID del macetero', required: true })
  async deleteMacetero(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.productosService.deleteMacetero(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Macetero eliminado con éxito.' });
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
  @Put('maceteros/update/:id')
  @ApiOperation({
    summary: 'Actualizar un macetero',
    description: 'Actualiza los detalles de un macetero existente',
  })
  @ApiResponse({ status: 200, description: 'Macetero actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Macetero no encontrado.' })
  @ApiBody({ type: UpdateMaceteroDto })
  @ApiParam({ name: 'id', description: 'ID del macetero', required: true })
  async updateMacetero(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateMaceteroDto: UpdateMaceteroDto,
    @Res() res: Response,
  ) {
    try {
      const macetero = await this.productosService.updateMacetero(
        id,
        updateMaceteroDto,
      );
      res.status(HttpStatus.OK).json(macetero);
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
  @Post('fertilizantes/create')
  @ApiOperation({
    summary: 'Crear un nuevo fertilizante',
    description: 'Crea un nuevo fertilizante en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Fertilizante creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateFertilizanteDto })
  async createFertilizante(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createFertilizanteDto: CreateFertilizanteDto,
    @Res() res: Response,
  ) {
    try {
      const fertilizante = await this.productosService.createFertilizante(
        createFertilizanteDto,
      );
      res.status(HttpStatus.CREATED).json(fertilizante);
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

  @Get('fertilizantes/get')
  @ApiOperation({
    summary: 'Obtener fertilizantes paginados',
    description: 'Obtiene una lista de fertilizantes paginados',
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Fertilizantes obtenidos con éxito.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async getFertilizantesPaginados(
    @Query('page') page: number,
    @Query('size') size: number,
    @Res() res: Response,
  ) {
    try {
      const fertilizantes =
        await this.productosService.getFertilizantesPaginados(page, size);
      res.status(HttpStatus.OK).json(fertilizantes);
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
  @Get('fertilizantes/getbyid/:id')
  @ApiOperation({
    summary: 'Obtener un fertilizante por ID',
    description:
      'Devuelve los detalles de un fertilizante específico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del fertilizante encontrado',
    type: Fertilizante,
  })
  @ApiResponse({
    status: 404,
    description: 'Fertilizante no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del fertilizante',
    required: true,
  })
  async findOneFertilizante(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const fertilizante = await this.productosService.findFertilizanteById(id);
      if (!fertilizante) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Fertilizante no encontrado' });
      }
      res.status(HttpStatus.OK).json(fertilizante);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el fertilizante.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('fertilizantes/update/:id')
  @ApiOperation({
    summary: 'Actualizar un fertilizante',
    description: 'Actualiza los detalles de un fertilizante existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Fertilizante actualizado con éxito.',
  })
  @ApiResponse({ status: 404, description: 'Fertilizante no encontrado.' })
  @ApiBody({ type: UpdateFertilizanteDto })
  @ApiParam({ name: 'id', description: 'ID del fertilizante', required: true })
  async updateFertilizante(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateFertilizanteDto: UpdateFertilizanteDto,
    @Res() res: Response,
  ) {
    try {
      const fertilizante = await this.productosService.updateFertilizante(
        id,
        updateFertilizanteDto,
      );
      res.status(HttpStatus.OK).json(fertilizante);
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

  @Delete('fertilizantes/delete/:id')
  @ApiOperation({
    summary: 'Eliminar un fertilizante',
    description: 'Elimina un fertilizante existente por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Fertilizante eliminado con éxito.',
  })
  @ApiResponse({ status: 404, description: 'Fertilizante no encontrado.' })
  @ApiParam({ name: 'id', description: 'ID del fertilizante', required: true })
  async deleteFertilizante(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.productosService.deleteFertilizante(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Fertilizante eliminado con éxito.' });
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
