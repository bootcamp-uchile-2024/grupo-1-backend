import {
  Controller,
  Get,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Res,
  Delete,
  Put,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { OrdenComprasService } from '../service/orden-compras.service';
import { CreateOrdenCompraDto } from '../dto/create-orden-compra.dto';
import { ValidaEmailIdPipe } from 'src/comunes/pipes/validaEmailId.pipe';
import { CreateDetalleOrdenCompraDto } from '../dto/create-detalle-orden-compra.dto';
import { DetalleOrdenComprasService } from '../service/detalle-orden-compras.service';
import { ValidaProductoCarritoPipe } from 'src/comunes/pipes/ValidaProductoCarrito,pipe';
import { ValidaEliminaProductoCarroPipe } from 'src/comunes/pipes/validaEliminaProductoCarro.pipe';
import { QuitarProductoCarritoDto } from '../dto/quitarProductoCarrito.dto';
import { ValidaBuscaCarritoPipe } from 'src/comunes/pipes/validaBuscaCarrito.pipe';
import { CreateVentaDto } from '../dto/create-venta-dto';
import { VentasService } from '../service/ventas.service';
import { JwtGuard } from 'src/jwt/jwt.guard';
import { RolesAutorizados } from 'src/comunes/decorator/rol.decorator';
import { Rol } from 'src/enum/rol.enum';
@ApiTags('Gestion - Ventas')
@Controller('ventas')
//@UsePipes(new ValidationPipe({ transform: true }))
export class VentasController {
  private readonly logger = new Logger(VentasController.name);

  constructor(
    private readonly ordenComprasService: OrdenComprasService,
    private readonly detalleOrdenCompraService: DetalleOrdenComprasService,
    private readonly ventaService: VentasService,
  ) {}
  @ApiTags('Gestion-Ventas')
  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description:
      'Esta funcionalidad crea orden compra la cual retorna orden creada la cual permite ir agregando y quitando producto en otro endpoint',
  })
  @ApiResponse({
    status: 200,
    description: 'Orden de Compra Creada desde carrito compras',
  })
  @ApiResponse({ status: 400, description: 'Orden no Creada' })
  @ApiBody({ type: CreateOrdenCompraDto })
  @Post('/carrito/')
  @UsePipes(ValidaEmailIdPipe)
  async create(@Body() CreateOrdenCompraDto: CreateOrdenCompraDto) {
    this.logger.log(
      `Iniciando creación de orden de compra: ${JSON.stringify(CreateOrdenCompraDto)}`,
    );
    const result = await this.ordenComprasService.create(CreateOrdenCompraDto);
    this.logger.log(
      `Orden de compra creada exitosamente: ${JSON.stringify(result)}`,
    );
    return result;
  }
  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description: 'Esta funcionalidad permite añadir producto a carro compras',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto añadido',
  })
  @ApiResponse({ status: 400, description: 'Producto  no Añadido' })
  @ApiBody({ type: CreateDetalleOrdenCompraDto })
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
  @Post('/carrito/addItem/')
  //@UsePipes(ValidaProductoCarritoPipe)
  async agregaProductoCarrito(
    @Body(ValidaProductoCarritoPipe)
    CreateDetalleOrdenCompraDto: CreateDetalleOrdenCompraDto,
  ) {
    this.logger.log(
      `Agregando producto al carrito: ${JSON.stringify(CreateDetalleOrdenCompraDto)}`,
    );
    const result = await this.detalleOrdenCompraService.create(
      CreateDetalleOrdenCompraDto,
    );
    this.logger.log(
      `Producto agregado exitosamente: ${JSON.stringify(result)}`,
    );
    return result;
  }
  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description: 'Esta funcionalidad permite quitar producto del carro compras',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto con ID 6 ha sido eliminado del carrito',
  })
  @ApiResponse({ status: 400, description: 'Producto  no eliminado' })
  @ApiBody({ type: QuitarProductoCarritoDto })
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
  @Delete('/carrito/removeItem/')
  @ApiTags('Gestion-Ventas')
  async quitaProductoCarrito(
    @Body(ValidaEliminaProductoCarroPipe)
    quitarProducto: QuitarProductoCarritoDto,
  ) {
    this.logger.log(
      `Eliminando producto del carrito: ${JSON.stringify(quitarProducto)}`,
    );
    const response =
      await this.detalleOrdenCompraService.eliminaProductoDetalle(
        quitarProducto.idOrden,
        quitarProducto.idProducto,
      );
    this.logger.log(
      `Producto eliminado exitosamente: ${JSON.stringify(response)}`,
    );

    return {
      status: 'success',
      message: response.mensaje,
    };
  }
  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description:
      'Esta funcionalidad permite actalizar la cantidad producto del carro compras, si coloca 0 lo elimina',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto con ID 6 ha sido actualizado en carrito',
  })
  @ApiResponse({ status: 400, description: 'Producto  no actualizado' })
  @ApiBody({ type: CreateDetalleOrdenCompraDto })
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
  @Put('/carrito/updateItem/')
  @ApiTags('Gestion-Ventas')
  async modificaCantidadProductoCarrito(
    @Body(ValidaProductoCarritoPipe)
    actualizaCarrito: CreateDetalleOrdenCompraDto,
  ) {
    const response =
      await this.detalleOrdenCompraService.actualizarDetalleOrdenCompra(
        actualizaCarrito,
      );
    return {
      status: 'success',
      message: response.mensaje,
    };
  }
  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description:
      'Esta funcionalidad permite buscar carrito vigente por email y/o id cliente',
  })
  @ApiResponse({
    status: 200,
    description: 'Existe Carrito Vigente',
  })
  @ApiResponse({ status: 400, description: 'No tiene carritos vigentes' })
  @ApiQuery({
    name: 'emailComprador',
    required: false,
    type: String,
    description: 'El email comprador para buscar su carrito.',
  })
  @ApiQuery({
    name: 'idUsuario',
    required: false,
    type: Number,
    description: 'El ID usuario para buscar su carrito.',
  })
  //@ApiBearerAuth()
  //@UseGuards(JwtGuard)
  //@RolesAutorizados(Rol.ADMIN, Rol.USUARIO, Rol.INVITADO)
  @UsePipes(ValidaBuscaCarritoPipe)
  @Get('/carrito/creado/')
  @ApiTags('Gestion-Ventas')
  async findOne(@Query() query: any) {
    this.logger.log(
      `Buscando carrito con parámetros: ${JSON.stringify(query)}`,
    );
    const { emailComprador, idUsuario } = query;
    const carrito = await this.ordenComprasService.buscarCarrito(
      emailComprador,
      idUsuario,
    );
    this.logger.log(`Carrito encontrado: ${JSON.stringify(carrito)}`);
    return carrito;
  }

  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description:
      'Esta funcionalidad permite pasar carrito compra a portal pagos',
  })
  @ApiResponse({
    status: 200,
    description: 'Carrito enviado a Portal Pago',
  })
  @ApiResponse({ status: 400, description: 'No existe carrito' })
  @ApiQuery({
    name: 'idOC',
    required: false,
    type: Number,
    description: 'El ID orden de compra para buscar su carrito.',
  })
  @Put('/carrito/finaliza/')
  @ApiTags('Gestion-Ventas')
  async finalizaCarrito(@Query() query: any) {
    this.logger.log(`Finalizando carrito con ID: ${query.idOC}`);
    const { idOC } = query;
    const carrito = await this.ordenComprasService.finalizaCarrito(idOC);
    this.logger.log(
      `Carrito finalizado exitosamente: ${JSON.stringify(carrito)}`,
    );
    return carrito;
  }

  @ApiOperation({
    summary: 'Historia Usuario : Completa Venta',
    description:
      'Esta funcionalidad crea la venta segun el pago realizado para el carrito compras',
  })
  @ApiResponse({
    status: 201,
    description: 'Venta realizada',
  })
  @ApiResponse({ status: 400, description: 'Venta no completada' })
  @ApiBody({ type: CreateVentaDto })
  @Post('/')
  @ApiTags('Gestion-Ventas')
  async createVenta(@Body() CreateVentaDto: CreateVentaDto) {
    this.logger.log(`Creando venta: ${JSON.stringify(CreateVentaDto)}`);
    const result = await this.ventaService.createVenta(CreateVentaDto);
    this.logger.log(`Venta creada exitosamente: ${JSON.stringify(result)}`);
    return result;
  }

  @ApiOperation({
    summary: 'Historia Usuario H005: Carrito Compras',
    description: 'Esta funcionalidad permite buscar ventas realizadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Historial Ventas',
  })
  @ApiResponse({ status: 400, description: 'No hay ventas vigentes' })
  @ApiQuery({
    name: 'emailComprador',
    required: false,
    type: String,
    description: 'El email comprador para buscar su historial.',
  })
  @ApiQuery({
    name: 'idUsuario',
    required: false,
    type: Number,
    description: 'El ID usuario para buscar su historial.',
  })
  @Get('/historial/')
  async buscarVentas(@Query() query: any) {
    this.logger.log(`Buscando historial de ventas: ${JSON.stringify(query)}`);
    const { emailComprador, idUsuario } = query;
    const carrito = await this.ordenComprasService.historialCompras(
      emailComprador,
      idUsuario,
    );
    this.logger.log(
      `Historial de ventas encontrado: ${JSON.stringify(carrito)}`,
    );
    return carrito;
  }
}
