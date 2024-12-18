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
  UploadedFile,
  UseInterceptors,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiConsumes,
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
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Post('/create')
  @ApiTags('Gestion-Productos')
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
  @ApiResponse({
    status: 200,
    description: 'Listado de todos los productos',
    type: [Producto],
  })
  @ApiResponse({ status: 404, description: 'No se encontraron productos' })
  @ApiTags('Gestion-Productos')
  @ApiOperation({
    summary: 'Historia Usuario H004: Listado de Productos Plantopia',
    description:
      'Lista todos los productos del catalogo de plantopia con paginación',
  })
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
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
      error('Error al obtener los productos: ' + error.message);
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
  @ApiTags('Gestion-Productos')
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
      error('Error al obtener el producto: ' + error.message);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el producto.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/update/:id')
  @ApiTags('Gestion-Productos')
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
      error('Error al actualizar producto: ' + error.message);
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
  @ApiTags('Gestion-Productos-Categorias')
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
  @ApiTags('Gestion-Productos-Categorias')
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
  @ApiQuery({ name: 'page', required: true, type: Number })
  @ApiQuery({ name: 'size', required: true, type: Number })
  async findAllCategorias(
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
    @Res() res: Response,
  ) {
    try {
      const categorias = await this.productosService.findAllCategorias(
        page,
        size,
      );
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
  @ApiTags('Gestion-Productos-Categorias')
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
  @ApiTags('Gestion-Productos-Categorias')
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
  @ApiTags('Gestion-Productos-Categorias')
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

  @Post('plantas/create')
  @ApiTags('Gestion-Productos-Plantas')
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
  @ApiTags('Gestion-Productos-Plantas')
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
  @ApiTags('Gestion-Productos-Plantas')
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
  @ApiTags('Gestion-Productos-Plantas')
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
  @Post('maceteros/create')
  @ApiTags('Gestion-Productos-Maceteros')
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
  @ApiTags('Gestion-Productos-Maceteros')
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
  @ApiTags('Gestion-Productos-Maceteros')
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

  @Put('maceteros/update/:id')
  @ApiTags('Gestion-Productos-Maceteros')
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
  @ApiTags('Gestion-Productos-Fertilizantes')
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
  @ApiTags('Gestion-Productos-Fertilizantes')
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
  @ApiTags('Gestion-Productos-Fertilizantes')
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
  @ApiTags('Gestion-Productos-Fertilizantes')
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

  @Post('sustratos/create')
  @ApiTags('Gestion-Productos-Sustratos')
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
  @ApiTags('Gestion-Productos-Sustratos')
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
  @ApiTags('Gestion-Productos-Sustratos')
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
  @ApiTags('Gestion-Productos-Sustratos')
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

  @Post('add-image/:id')
  @ApiTags('Gestion-Productos')
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'ID del producto al que se le añadirá la imagen',
    example: 1,
  })
  @ApiBody({
    description: 'Base64 de la imagen que será añadida al producto',
    schema: {
      type: 'object',
      properties: {
        imageBase64: {
          type: 'string',
          description: 'Cadena codificada en base64 que representa la imagen',
          example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'La imagen ha sido añadida correctamente',
    schema: {
      example: {
        message: 'Imagen añadida correctamente',
        producto: {
          id: 1,
          nombre: 'Ejemplo de Producto',
          imagenes: [
            {
              id: 1,
              ruta: '/images/1-1698352365146.jpg',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Producto no encontrado',
    schema: {
      example: {
        message: 'Producto no encontrado',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al agregar la imagen',
    schema: {
      example: {
        message: 'Error al agregar la imagen',
      },
    },
  })
  async addImage(
    @Param('id') id: number,
    @Body('imageBase64') imageBase64: string,
    @Res() res: Response,
  ) {
    try {
      const producto = await this.productosService.addImageToProduct(
        id,
        imageBase64,
      );
      return res.json({ message: 'Imagen añadida correctamente', producto });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Error al agregar la imagen',
      });
    }
  }

  @Post('edit-image/:productId/:imageId')
  @ApiTags('Gestion-Productos')
  @ApiParam({ name: 'productId', description: 'ID del producto' })
  @ApiParam({
    name: 'imageId',
    description: 'ID de la imagen que se quiere editar',
  })
  @ApiBody({
    description: 'Base64 de la nueva imagen que reemplazará a la existente',
    schema: {
      type: 'object',
      properties: {
        imageBase64: {
          type: 'string',
          description: 'Cadena codificada en base64 de la nueva imagen',
          example: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Imagen editada correctamente',
    schema: {
      example: {
        message: 'Imagen editada correctamente',
        producto: {
          id: 1,
          nombre: 'Ejemplo de Producto',
          imagenes: [
            {
              id: 2,
              urlImagen: '/images/1-1698352365146.jpg',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Producto o imagen no encontrada',
  })
  async editImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
    @Body('imageBase64') imageBase64: string,
    @Res() res: Response,
  ) {
    try {
      const producto = await this.productosService.editImageForProduct(
        productId,
        imageId,
        imageBase64,
      );
      return res.json({
        message: 'Imagen editada correctamente',
        producto,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Error al editar la imagen',
      });
    }
  }

  @Delete('delete-image/:productId/:imageId')
  @ApiTags('Gestion-Productos')
  @ApiParam({ name: 'productId', description: 'ID del producto' })
  @ApiParam({ name: 'imageId', description: 'ID de la imagen a eliminar' })
  @ApiResponse({
    status: 200,
    description: 'Imagen eliminada correctamente',
    schema: {
      example: {
        message: 'Imagen eliminada correctamente',
        producto: {
          id: 1,
          nombre: 'Ejemplo de Producto',
          imagenes: [],
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Producto o imagen no encontrada',
  })
  async deleteImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
    @Res() res: Response,
  ) {
    try {
      const producto = await this.productosService.deleteImageFromProduct(
        productId,
        imageId,
      );
      return res.json({
        message: 'Imagen eliminada correctamente',
        producto,
      });
    } catch (error) {
      return res.status(error.status || 500).json({
        message: error.message || 'Error al eliminar la imagen',
      });
    }
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directorio de destino
        filename: (req, file, callback) => {
          const filename = `${Date.now()}-${file.originalname}`;
          callback(null, filename);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // Limitar el tamaño del archivo a 10MB
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/image\/*/)) {
          return callback(
            new BadRequestException('Solo se permiten imágenes.'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  @Patch(':id/carga-imagen')
  @ApiTags('Gestion-Productos')
  @ApiOperation({ summary: 'Subir una imagen para un producto' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 200,
    description: 'Imagen subida con éxito y asociada al producto.',
  })
  @ApiResponse({ status: 400, description: 'Error al subir la imagen.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  async cargarImagen(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No se ha recibido el archivo.');
    }
    const producto = await this.productosService.uploadProductImage(
      parseInt(id, 10),
      file,
    );
    return {
      message: `Imagen cargada correctamente para el producto con ID ${id}`,
      data: producto,
    };
  }

  @Patch(':id/habilitar')
  @ApiTags('Gestion-Productos')
  @ApiOperation({ summary: 'Habilitar un producto' })
  @ApiResponse({
    status: 200,
    description: 'Producto habilitado correctamente',
    type: Producto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto que se va a habilitar',
  })
  async habilitarProducto(@Param('id', ParseIntPipe) id: number) {
    const producto = await this.productosService.habilitarProducto(id);
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  @Patch(':id/deshabilitar')
  @ApiTags('Gestion-Productos')
  @ApiOperation({ summary: 'Deshabilitar un producto' })
  @ApiParam({
    name: 'id',
    description: 'ID del producto que se va a deshabilitar',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto deshabilitado correctamente',
    type: Producto,
  })
  @ApiResponse({
    status: 404,
    description: 'Producto no encontrado',
  })
  async deshabilitar(@Param('id') id: number): Promise<Producto> {
    return this.productosService.deshabilitarProducto(id);
  }
  @ApiTags('Filtros - Plantas')
  @Get('plantas/filtropetfriendly')
  @ApiOperation({
    summary: 'Filtrar plantas pet friendly',
    description: 'Devuelve una lista de plantas pet friendly',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de plantas pet friendly obtenida con éxito.',
    type: [Planta],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al obtener las plantas pet friendly.',
  })
  @ApiQuery({
    name: 'filtro',
    description: 'Filtro para obtener plantas pet friendly (true o false)',
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al obtener las plantas pet friendly.',
  })
  @ApiQuery({
    name: 'filtro',
    description: 'Filtro para obtener plantas pet friendly (true o false)',
    required: true,
    enum: ['true', 'false'],
  })
  async filtroPetFriendly(
    @Query('filtro') filtro: string, // Recibimos el filtro como string
    @Res() res: Response,
  ) {
    try {
      const filtroBooleano = filtro === 'true' ? 0 : 1;
      const plantas =
        await this.productosService.filtroPetFriendly(filtroBooleano);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Plantas pet friendly obtenidas con éxito',
        data: plantas,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
          error: 'Error al obtener las plantas pet friendly.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('plantas/filtrocuidados')
  @ApiTags('Filtros - Plantas')
  @ApiOperation({
    summary: 'Filtrar plantas segun dificultad de cuidado',
    description: 'Devuelve una lista de plantas segun dificultad de cuidado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de plantas obtenida con éxito.',
    type: [Planta],
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al obtener el filtro de cuidados.',
  })
  @ApiQuery({
    name: 'filtro',
    description: 'Nivel de cuidado permitido para filtrar las plantas',
    required: true,
    enum: [
      'Avanzado',
      'Difícil',
      'Experto',
      'Fácil',
      'Intermedio',
      'Maestro',
      'Moderado',
      'Muy Difícil',
      'Principiante',
      'Profesional',
    ],
  })
  async filtroCuidados(@Query('filtro') filtro: string, @Res() res: Response) {
    try {
      const plantas = await this.productosService.filtroCuidados(filtro);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Plantas obtenidas con éxito',
        data: plantas,
      });
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          data: error,
          error: 'Error al obtener las plantas.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
