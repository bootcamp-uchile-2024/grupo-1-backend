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
import { UpdatePlantaDto } from '../dto/update-planta.dto';
import { Planta } from '../entities/planta.entity';
import { UpdateSustratoDto } from '../dto/update-sustrato.dto';
import { Sustrato } from '../entities/sustrato.entity';
import { CreateSustratoDto } from '../dto/create-sustrato.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('/create')
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
  @Get('/catalogo')
  @ApiOperation({
    summary: 'Historia Usuario H004: Listado de Productos Plantopia',
    description:
      'Lista todos los productos del catalogo de plantopia con paginación',
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Listado de todos los productos',
    type: [Producto],
  })
  async findAllCatalogo(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Res() res: Response,
  ) {
    try {
      const productos = await this.productosService.findAllCatalogoPaginado(
        page,
        size,
      );
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
  @Get('/catalogobyid/:id')
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
  @Delete('/delete/:id')
  @ApiOperation({
    summary: 'Eliminar un producto',
    description: 'Elimina un producto existente por su ID',
  })
  @ApiResponse({ status: 200, description: 'Producto eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiParam({ name: 'id', description: 'ID del producto', required: true })
  async deleteProducto(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.productosService.deleteProducto(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Producto eliminado con éxito.' });
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
  @Put('/update/:id')
  @ApiOperation({
    summary: 'Actualizar un producto',
    description: 'Actualiza los detalles de un producto existente',
  })
  @ApiResponse({ status: 200, description: 'Producto actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  @ApiBody({ type: CreateProductoDto })
  @ApiParam({ name: 'id', description: 'ID del producto', required: true })
  async updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateProductoDto: CreateProductoDto,
    @Res() res: Response,
  ) {
    try {
      const producto = await this.productosService.updateProducto(
        id,
        updateProductoDto,
      );
      res.status(HttpStatus.OK).json(producto);
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

  @Post('categorias/create')
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
  @Get('categorias/get')
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
  @Get('categorias/getbyid/:id')
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

  @Get('categorias/getbynombre/:nombrecategoria')
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
  @Put('categorias/update/:id')
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

  @Delete('categorias/delete/:id')
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

  @Post('plantas/create')
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
  @Get('plantas/get')
  @ApiOperation({
    summary: 'Obtener plantas paginadas',
    description: 'Obtiene una lista de plantas',
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
  @ApiResponse({ status: 200, description: 'Plantas obtenidas con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async getPlantasPaginadas(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Res() res: Response,
  ) {
    try {
      const plantas = await this.productosService.getPlantasPaginadas(
        page,
        size,
      );
      res.status(HttpStatus.OK).json(plantas);
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
  @Get('plantas/getbyid/:id')
  @ApiOperation({
    summary: 'Obtener una planta por ID',
    description: 'Devuelve los detalles de una planta específica por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles de la planta encontrada',
    type: Planta,
  })
  @ApiResponse({
    status: 404,
    description: 'Planta no encontrada',
  })
  @ApiParam({
    name: 'id',
    description: 'ID de la planta',
    required: true,
  })
  async findPlantaById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const planta = await this.productosService.findPlantaById(id);
      if (!planta) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Planta no encontrada' });
      }
      res.status(HttpStatus.OK).json(planta);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener la planta.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Put('plantas/update/:id')
  @ApiOperation({
    summary: 'Actualizar una planta',
    description: 'Actualiza los detalles de una planta existente',
  })
  @ApiResponse({ status: 200, description: 'Planta actualizada con éxito.' })
  @ApiResponse({ status: 404, description: 'Planta no encontrada.' })
  @ApiBody({ type: UpdatePlantaDto })
  @ApiParam({ name: 'id', description: 'ID de la planta', required: true })
  async updatePlanta(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updatePlantaDto: UpdatePlantaDto,
    @Res() res: Response,
  ) {
    try {
      const planta = await this.productosService.updatePlanta(
        id,
        updatePlantaDto,
      );
      res.status(HttpStatus.OK).json(planta);
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
  @Delete('plantas/delete/:id')
  @ApiOperation({
    summary: 'Eliminar una planta',
    description: 'Elimina una planta existente por su ID',
  })
  @ApiResponse({ status: 200, description: 'Planta eliminada con éxito.' })
  @ApiResponse({ status: 404, description: 'Planta no encontrada.' })
  @ApiParam({ name: 'id', description: 'ID de la planta', required: true })
  async deletePlanta(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.productosService.deletePlanta(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Planta eliminada con éxito.' });
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
  @Post('sustratos/create')
  @ApiOperation({
    summary: 'Crear un nuevo sustrato',
    description: 'Crea un nuevo sustrato en el sistema',
  })
  @ApiResponse({ status: 201, description: 'Sustrato creado con éxito.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  @ApiBody({ type: CreateSustratoDto })
  async createSustrato(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createSustratoDto: CreateSustratoDto,
    @Res() res: Response,
  ) {
    try {
      const sustrato =
        await this.productosService.createSustrato(createSustratoDto);
      res.status(HttpStatus.CREATED).json(sustrato);
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

  @Get('sustratos/get')
  @ApiOperation({
    summary: 'Obtener sustratos paginados',
    description: 'Devuelve una lista de sustratos paginados',
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
  @ApiResponse({
    status: 200,
    description: 'Lista de sustratos obtenida con éxito.',
    type: [Sustrato],
  })
  async findAllSustratos(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Res() res: Response,
  ) {
    try {
      const sustratos = await this.productosService.findAllSustratos(
        page,
        size,
      );
      res.status(HttpStatus.OK).json(sustratos);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los sustratos.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('sustratos/getbyid/:id')
  @ApiOperation({
    summary: 'Obtener un sustrato por ID',
    description: 'Devuelve los detalles de un sustrato específico por su ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Detalles del sustrato encontrado',
    type: Sustrato,
  })
  @ApiResponse({
    status: 404,
    description: 'Sustrato no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del sustrato',
    required: true,
  })
  async findSustratoById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const sustrato = await this.productosService.findSustratoById(id);
      if (!sustrato) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Sustrato no encontrado' });
      }
      res.status(HttpStatus.OK).json(sustrato);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el sustrato.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('sustratos/update/:id')
  @ApiOperation({
    summary: 'Actualizar un sustrato',
    description: 'Actualiza los detalles de un sustrato existente',
  })
  @ApiResponse({ status: 200, description: 'Sustrato actualizado con éxito.' })
  @ApiResponse({ status: 404, description: 'Sustrato no encontrado.' })
  @ApiBody({ type: UpdateSustratoDto })
  @ApiParam({ name: 'id', description: 'ID del sustrato', required: true })
  async updateSustrato(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateSustratoDto: UpdateSustratoDto,
    @Res() res: Response,
  ) {
    try {
      const sustrato = await this.productosService.updateSustrato(
        id,
        updateSustratoDto,
      );
      res.status(HttpStatus.OK).json(sustrato);
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

  @Delete('sustratos/delete/:id')
  @ApiOperation({
    summary: 'Eliminar un sustrato',
    description: 'Elimina un sustrato existente por su ID',
  })
  @ApiResponse({ status: 200, description: 'Sustrato eliminado con éxito.' })
  @ApiResponse({ status: 404, description: 'Sustrato no encontrado.' })
  @ApiParam({ name: 'id', description: 'ID del sustrato', required: true })
  async deleteSustrato(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.productosService.deleteSustrato(id);
      res
        .status(HttpStatus.OK)
        .json({ message: 'Sustrato eliminado con éxito.' });
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
