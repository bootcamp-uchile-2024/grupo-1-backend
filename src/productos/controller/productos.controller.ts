import { FiltrosService } from '../service/subservice/filtros.service';
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
  UploadedFiles,
  InternalServerErrorException,
  UseGuards,
  Logger,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiParam,
  ApiConsumes,
  ApiBearerAuth,
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
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProd2Dto } from '../dto/create-prod2.dto';
import { PlantaService } from '../service/subservice/plantas.service';
import { MaceterosService } from '../service/subservice/maceteros.service';
import { FertilizantesService } from '../service/subservice/fertilizantes.service';
import { SustratosService } from '../service/subservice/sustratos.service';
import { CategoriasService } from '../service/subservice/categorias.service';
import { RolesAutorizados } from 'src/comunes/decorator/rol.decorator';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { Rol } from 'src/enum/rol.enum';

@Controller('productos')
export class ProductosController {
  private readonly logger = new Logger(ProductosController.name);

  constructor(
    private readonly productosService: ProductosService,
    private readonly PlantaService: PlantaService,
    private readonly MaceterosService: MaceterosService,
    private readonly FertilizantesService: FertilizantesService,
    private readonly SustratosService: SustratosService,
    private readonly FiltrosService: FiltrosService,
    private readonly CategoriasService: CategoriasService,
    private readonly plantasService: PlantaService,
  ) {}

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
    this.logger.log(
      `Iniciando creación de producto: ${JSON.stringify(createProductoDto)}`,
    );
    try {
      const producto =
        await this.productosService.createProducto(createProductoDto);
      this.logger.log(`Producto creado exitosamente con ID: ${producto.id}`);
      res.status(HttpStatus.CREATED).json(producto);
    } catch (error) {
      this.logger.error(`Error al crear producto: ${error.message}`);
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Datos inválidos.' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  ////@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
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
    this.logger.log(`Obteniendo catálogo - página: ${page}, tamaño: ${size}`);
    try {
      const productos = await this.productosService.findAllCatalogoPaginado(
        page,
        size,
      );
      this.logger.log(
        `Catálogo obtenido exitosamente. Total items: ${productos.length}`,
      );
      res.status(HttpStatus.OK).json(productos);
    } catch (error) {
      this.logger.error(`Error al obtener catálogo: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener los productos.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  ////@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
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
    this.logger.log(`Buscando producto por ID: ${id}`);
    try {
      const producto = await this.productosService.porProducto(id);
      if (!producto) {
        this.logger.warn(`Producto no encontrado con ID: ${id}`);
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Producto no encontrado' });
      }
      this.logger.log(`Producto encontrado exitosamente: ${id}`);
      res.status(HttpStatus.OK).json(producto);
    } catch (error) {
      this.logger.error(`Error al obtener producto ${id}: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al obtener el producto.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
    this.logger.log(
      `Actualizando producto ${id} con datos: ${JSON.stringify(updateProductoDto)}`,
    );
    try {
      const producto = await this.productosService.updateProducto(
        id,
        updateProductoDto,
      );
      this.logger.log(`Producto ${id} actualizado exitosamente`);
      res.status(HttpStatus.OK).json(producto);
    } catch (error) {
      this.logger.error(`Error al actualizar producto ${id}: ${error.message}`);
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Datos inválidos.' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN)
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
    this.logger.log('Iniciando creación de nueva categoría');
    try {
      const categoria =
        await this.CategoriasService.createCategoria(createCategoriaDto);
      this.logger.log(`Categoría creada exitosamente con ID: ${categoria.id}`);
      res.status(HttpStatus.CREATED).json(categoria);
    } catch (error) {
      this.logger.error(`Error al crear categoría: ${error.message}`);
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
    this.logger.log(`Buscando categorías - página: ${page}, tamaño: ${size}`);
    try {
      const categorias = await this.CategoriasService.findAllCategorias(
        page,
        size,
      );
      this.logger.log(`Se encontraron categorías exitosamente`);
      res.status(HttpStatus.OK).json(categorias);
    } catch (error) {
      this.logger.error(`Error al obtener categorías: ${error.message}`);
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
      const categoria = await this.CategoriasService.findCategoriaById(id);
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
        await this.CategoriasService.findCategoriaIdByName(nombrecategoria);
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
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
      const categoria = await this.CategoriasService.updateCategoria(
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
      const planta = await this.PlantaService.createPlanta(createPlantaDto);
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
    this.logger.log(
      `Obteniendo plantas paginadas - página: ${page}, tamaño: ${size}`,
    );
    try {
      const plantas = await this.PlantaService.getPlantasPaginadas(page, size);
      this.logger.log('Plantas obtenidas exitosamente');
      res.status(HttpStatus.OK).json(plantas);
    } catch (error) {
      this.logger.error(`Error al obtener plantas: ${error.message}`);
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
    summary: 'Obtener una planta por ID de producto',
    description:
      'Devuelve los detalles de una planta específica por el ID del producto',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles de la planta encontrada',
    type: Planta,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Planta no encontrada',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al obtener la planta.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    required: true,
  })
  async findOnePlanta(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const planta = await this.PlantaService.findPlantaById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Planta encontrada exitosamente',
        data: planta,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
      const planta = await this.PlantaService.updatePlanta(id, updatePlantaDto);
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
        await this.MaceterosService.createMacetero(createMaceteroDto);
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  ////@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
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
      const maceteros = await this.MaceterosService.getMaceterosPaginados(
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  ////@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
  @Get('maceteros/getbyid/:id')
  @ApiTags('Gestion-Productos-Maceteros')
  @ApiOperation({
    summary: 'Obtener un macetero por ID de producto',
    description:
      'Devuelve los detalles de un macetero específico por el ID del producto',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Detalles del macetero encontrado',
    type: Macetero,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Macetero no encontrado',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error al obtener el macetero.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID del producto',
    required: true,
  })
  async findOneMacetero(@Param('id', ParseIntPipe) id: number): Promise<any> {
    try {
      const macetero = await this.MaceterosService.findMaceteroById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Macetero encontrado exitosamente',
        data: macetero,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
  @Put('maceteros/update/:id')
  @ApiTags('Gestion-Productos-Maceteros')
  @ApiOperation({
    summary: 'Actualizar un macetero',
    description: 'Actualiza los detalles de un macetero existente',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Macetero actualizado con éxito.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Macetero no encontrado.',
  })
  @ApiBody({ type: UpdateMaceteroDto })
  @ApiParam({ name: 'id', description: 'ID del macetero', required: true })
  async updateMacetero(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    updateMaceteroDto: UpdateMaceteroDto,
    @Res() res: Response,
  ) {
    try {
      const macetero = await this.MaceterosService.updateMacetero(
        id,
        updateMaceteroDto,
      );
      res.status(HttpStatus.OK).json(macetero);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ message: 'Macetero no encontrado' });
      }
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al actualizar el macetero.',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
  @Post('fertilizantes/create')
  @ApiTags('Gestion-Productos-Fertilizantes')
  @ApiOperation({
    summary: 'Crear un nuevo fertilizante',
    description: 'Crea un nuevo fertilizante en el sistema',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Fertilizante creado con éxito.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos inválidos.',
  })
  @ApiBody({ type: CreateFertilizanteDto })
  async createFertilizante(
    @Body(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    createFertilizanteDto: CreateFertilizanteDto,
    @Res() res: Response,
  ) {
    try {
      const fertilizante = await this.FertilizantesService.createFertilizante(
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
    this.logger.log(
      `Obteniendo fertilizantes paginados - página: ${page}, tamaño: ${size}`,
    );
    try {
      const fertilizantes =
        await this.FertilizantesService.getFertilizantesPaginados(page, size);
      this.logger.log('Fertilizantes obtenidos exitosamente');
      res.status(HttpStatus.OK).json(fertilizantes);
    } catch (error) {
      this.logger.error(`Error al obtener fertilizantes: ${error.message}`);
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
    summary: 'Obtener un fertilizante por ID de producto',
    description:
      'Devuelve los detalles de un fertilizante específico por el ID del producto',
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
    description: 'ID del producto',
    required: true,
  })
  async findOneFertilizante(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const fertilizante =
        await this.FertilizantesService.findFertilizanteByProductoId(id);
      res.status(HttpStatus.OK).json(fertilizante);
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(HttpStatus.NOT_FOUND).json({ message: error.message });
      } else {
        throw new HttpException(
          {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            error: 'Error al obtener el fertilizante.',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
      const fertilizante = await this.FertilizantesService.updateFertilizante(
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
        await this.SustratosService.createSustrato(createSustratoDto);
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
    this.logger.log(`Buscando sustratos - página: ${page}, tamaño: ${size}`);
    try {
      const sustratos = await this.SustratosService.findAllSustratos(
        page,
        size,
      );
      this.logger.log('Sustratos encontrados exitosamente');
      res.status(HttpStatus.OK).json(sustratos);
    } catch (error) {
      this.logger.error(`Error al obtener sustratos: ${error.message}`);
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
    summary: 'Obtener un sustrato por ID de producto',
    description:
      'Devuelve los detalles de un sustrato específico por el ID del producto',
  })
  @ApiResponse({
    status: 200,
    description: 'Sustrato encontrado exitosamente',
  })
  @ApiResponse({
    status: 404,
    description: 'Sustrato no encontrado',
  })
  async findOneSustrato(@Param('id') id: number) {
    this.logger.verbose(`Buscando sustrato con ID: ${id}`);
    try {
      const sustrato = await this.SustratosService.findSustratoById(id);
      this.logger.debug(`Sustrato encontrado exitosamente con ID: ${id}`);
      return sustrato;
    } catch (error) {
      this.logger.error(
        `Error al buscar sustrato con ID ${id}: ${error.message}`,
      );
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
      const sustrato = await this.SustratosService.updateSustrato(
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
    this.logger.verbose(`Iniciando carga de imagen para producto ID: ${id}`);
    try {
      const producto = await this.productosService.addImageToProduct(
        id,
        imageBase64,
      );
      this.logger.log(`Imagen añadida exitosamente al producto ID: ${id}`);
      return res.json({ message: 'Imagen añadida correctamente', producto });
    } catch (error) {
      this.logger.error(
        `Error al añadir imagen al producto ${id}: ${error.message}`,
      );
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
    this.logger.verbose(
      `Iniciando edición de imagen ${imageId} para producto ${productId}`,
    );
    try {
      const producto = await this.productosService.editImageForProduct(
        productId,
        imageId,
        imageBase64,
      );
      this.logger.log(
        `Imagen ${imageId} editada exitosamente para producto ${productId}`,
      );
      return res.json({
        message: 'Imagen editada correctamente',
        producto,
      });
    } catch (error) {
      this.logger.error(
        `Error al editar imagen ${imageId} del producto ${productId}: ${error.message}`,
      );
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
    this.logger.verbose(
      `Iniciando eliminación de imagen ${imageId} del producto ${productId}`,
    );
    try {
      const producto = await this.productosService.deleteImageFromProduct(
        productId,
        imageId,
      );
      this.logger.log(
        `Imagen ${imageId} eliminada exitosamente del producto ${productId}`,
      );
      return res.json({
        message: 'Imagen eliminada correctamente',
        producto,
      });
    } catch (error) {
      this.logger.error(
        `Error al eliminar imagen ${imageId} del producto ${productId}: ${error.message}`,
      );
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
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        activo: {
          type: 'number',
          example: 1,
          description:
            'Estado de activación del producto (1: activo, 0: inactivo)',
        },
      },
    },
  })
  async habilitarProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: number },
  ) {
    try {
      const producto = await this.productosService.habilitarProducto(
        id,
        body.activo,
      );
      return {
        message: 'Producto habilitado exitosamente',
        data: producto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al habilitar el producto');
    }
  }

  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //////@RolesAutorizados(Rol.ADMIN)
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
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        activo: {
          type: 'number',
          example: 0,
          description:
            'Estado de activación del producto (1: activo, 0: inactivo)',
        },
      },
    },
  })
  async deshabilitar(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { activo: number },
  ) {
    try {
      const producto = await this.productosService.deshabilitarProducto(
        id,
        body.activo,
      );
      return {
        message: 'Producto deshabilitado exitosamente',
        data: producto,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Error al deshabilitar el producto',
      );
    }
  }
  @ApiTags('Filtros')
  @Get('plantas/filtropetfriendly')
  @ApiOperation({
    summary: 'Filtrar plantas pet friendly',
    description: 'Devuelve una lista de plantas pet friendly',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de plantas pet friendly obtenidas con éxito.',
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
    @Query('filtro') filtro: string,
    @Res() res: Response,
  ) {
    this.logger.log(`Aplicando filtro pet friendly: ${filtro}`);
    try {
      const filtroBooleano = filtro === 'true' ? 0 : 1;
      const plantas =
        await this.FiltrosService.filtroPetFriendly(filtroBooleano);
      this.logger.log(`Filtro pet friendly aplicado exitosamente`);
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Plantas pet friendly obtenidas con éxito',
        data: plantas,
      });
    } catch (error) {
      this.logger.error(
        `Error al aplicar filtro pet friendly: ${error.message}`,
      );
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
  @ApiTags('Filtros')
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
      const plantas = await this.FiltrosService.filtroCuidados(filtro);
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
  @ApiTags('Gestion-Productos')
  @Post('/newcreate')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Crear un producto con listado de imagenes' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Producto creado con éxito',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al crear el producto',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Error interno del servidor',
  })
  @ApiBody({
    description: 'Crear un producto con listado de imágenes',
    type: CreateProd2Dto,
    required: true,
    schema: { example: { nombre: 'Producto de prueba', precio: 1000 } },
  })
  @UseInterceptors(
    FilesInterceptor('imagenes', 10, {
      storage: diskStorage({
        destination: './uploads/productos',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
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
  //TODO: METODO PARA CREAR PRODUCTO JUNTO A SU IMAGEN
  async creaProductoImagen(
    @Body() CreateProd2Dto: CreateProd2Dto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!files || files.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Se deben subir al menos una imagen',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const rutasImagenes = files.map(
      (file) => `/uploads/productos/${file.filename}`,
    );

    try {
      const producto = await this.productosService.creaProductoImagen(
        CreateProd2Dto,
        rutasImagenes,
      );
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Producto creado exitosamente',
        data: producto,
        rutasImagenes,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear el producto',
          data: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  private handleException(error: any) {
    const status = error.getStatus
      ? error.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || 'Error interno del servidor';
    return {
      statusCode: status,
      message,
      error: error.response || null,
    };
  }
  @ApiTags('Filtros')
  @ApiOperation({
    summary: 'Filtrar plantas mas valoradas por los compradores',
    description:
      'Devuelve una lista de plantas mas valoradas por los compradores',
  })
  @ApiQuery({
    name: 'categoria',
    description: 'Categoria de la planta',
    required: true,
    enum: ['Plantas', 'Maceteros', 'Fertilizantes', 'Sustratos'],
  })
  @Get('plantas/masvaloradas')
  async filtroPlantasMasValoradas(
    @Query('categoria') categoria: string,
    @Res() res: Response,
  ) {
    this.logger.log(
      `Obteniendo plantas más valoradas para categoría: ${categoria}`,
    );
    try {
      const filtro = await this.FiltrosService.filtroMasValorados(categoria);
      this.logger.log('Plantas más valoradas obtenidas exitosamente');
      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: 'Plantas obtenidas con éxito',
        data: filtro,
      });
    } catch (error) {
      this.logger.error(
        `Error al obtener plantas más valoradas: ${error.message}`,
      );
      throw new HttpException(
        'Error al obtener las plantas más valoradas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/plantas/masvendidas')
  @ApiTags('Filtros')
  @ApiOperation({ summary: 'Obtener las plantas más vendidas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de las plantas más vendidas.',
    type: [Producto],
  })
  @ApiResponse({
    status: 404,
    description: 'Categoría "Planta" no encontrada.',
  })
  async obtenerPlantasMasVendidas(): Promise<Planta[]> {
    this.logger.log('Obteniendo plantas más vendidas');
    try {
      const plantas = await this.FiltrosService.obtenerPlantasMasVendidas();
      this.logger.log('Plantas más vendidas obtenidas exitosamente');
      return plantas;
    } catch (error) {
      this.logger.error(
        `Error al obtener plantas más vendidas: ${error.message}`,
      );
      throw new HttpException(
        'Ha ocurrido un error al obtener las plantas más vendidas.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/filtrocategoria')
  @ApiTags('Filtros')
  @ApiOperation({
    summary: 'Filtrar productos por categoría',
    description:
      'Devuelve una lista paginada de productos por categoría específica',
  })
  @ApiQuery({
    name: 'categoria',
    description: 'Nombre de la categoría a filtrar',
    required: true,
    enum: ['Plantas', 'Maceteros', 'Fertilizantes', 'Sustratos'],
  })
  @ApiQuery({
    name: 'pagina',
    description: 'Número de página',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'cantidad',
    description: 'Cantidad de elementos por página',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de productos filtrados por categoría',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error en los parámetros de la solicitud',
  })
  async filtrarPorCategoria(
    @Query('categoria') categoria: string,
    @Query('pagina', new DefaultValuePipe(1), ParseIntPipe) pagina: number,
    @Query('cantidad', new DefaultValuePipe(10), ParseIntPipe) cantidad: number,
  ) {
    this.logger.log(
      `Filtrando productos por categoría: ${categoria}, página: ${pagina}, límite: ${cantidad}`,
    );

    try {
      const resultado = await this.FiltrosService.filtrarPorCategoria(
        categoria,
        pagina,
        cantidad,
      );

      this.logger.log(
        `Filtrado exitoso. Total de elementos: ${resultado.total}`,
      );

      return {
        status: HttpStatus.OK,
        message: 'Productos filtrados exitosamente',
        data: {
          items: resultado.plantas,
          total: resultado.total,
          currentPage: pagina,
          totalPages: resultado.pages,
          cantidad,
        },
      };
    } catch (error) {
      this.logger.error(`Error al filtrar por categoría: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error al filtrar productos por categoría',
          message: error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
