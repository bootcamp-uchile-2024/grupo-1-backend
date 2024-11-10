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
import { CreateFertilizanteDto } from '../dto/create-fertilizante.dto';
import { Producto } from '../entities/producto.entity';
import { Categoria } from '../entities/categoria.entity';

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

  @Post('crear/macetero')
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

  @Get('maceteros/paginados')
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

  @Post('crear/fertilizante')
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

  @Get('fertilizantes/paginados')
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
}
