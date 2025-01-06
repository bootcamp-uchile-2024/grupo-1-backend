import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  UseInterceptors,
  UploadedFiles,
  Query,
  Res,
  HttpStatus,
  HttpException,
  Logger,
  ParseIntPipe,
  ValidationPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PlantaService } from '../service/subservice/plantas.service';
import { FiltrosService } from '../service/subservice/filtros.service';
import { CreatePlantaDto } from '../dto/create-planta.dto';
import { UpdatePlantaDto } from '../dto/update-planta.dto';
import { NewCreatePlantaDto } from '../dto/new-create-planta.dto';
import { Planta } from '../entities/planta.entity';
import { Producto } from '../entities/producto.entity';

@ApiTags('Gestion-Productos-Plantas')
@Controller('productos/plantas')
export class PlantasController {
  private readonly logger = new Logger(PlantasController.name);

  constructor(
    private readonly plantaService: PlantaService,
    private readonly filtrosService: FiltrosService,
  ) {}

  @Post('newcreate')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Crear una nueva planta con imágenes',
    description:
      'Crea una nueva planta con sus imágenes asociadas y todas sus relaciones...',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Planta creada exitosamente',
    type: Planta,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Error al crear la planta',
  })
  @ApiBody({ type: NewCreatePlantaDto })
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
  async newCreatePlanta(
    @Body() createPlantaDto: NewCreatePlantaDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    this.logger.log('Iniciando creación de planta con imágenes');

    if (!files || files.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Se debe subir al menos una imagen',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const rutasImagenes = files.map(
      (file) => `/uploads/productos/${file.filename}`,
    );

    try {
      const planta = await this.plantaService.newCreatePlanta(
        createPlantaDto,
        rutasImagenes,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message: 'Planta creada exitosamente',
        data: planta,
        rutasImagenes,
      };
    } catch (error) {
      this.logger.error(`Error al crear planta: ${error.message}`);
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Error al crear la planta',
          data: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get')
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
      const plantas = await this.plantaService.getPlantasPaginadas(page, size);
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

  @Get('getbyid/:id')
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
      const planta = await this.plantaService.findPlantaById(id);
      return {
        statusCode: HttpStatus.OK,
        message: 'Planta encontrada exitosamente',
        data: planta,
      };
    } catch (error) {
      return this.handleException(error);
    }
  }

  @Put('update/:id')
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
      const planta = await this.plantaService.updatePlanta(id, updatePlantaDto);
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

  // Métodos de filtros
  @Get('filtropetfriendly')
  @ApiTags('Filtros')
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
        await this.filtrosService.filtroPetFriendly(filtroBooleano);
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

  @Get('filtrocuidados')
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
      const plantas = await this.filtrosService.filtroCuidados(filtro);
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
  @ApiTags('Filtros')
  @Get('masvendidas')
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
      const plantas = await this.filtrosService.obtenerPlantasMasVendidas();
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
}
