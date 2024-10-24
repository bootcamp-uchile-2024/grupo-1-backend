//mport { Injectable } from '@nestjs/common';
//mport { InjectRepository } from '@nestjs/typeorm';
//mport { Producto } from 'entitychr/producto-entity';
//mport { Categoria } from 'entitychr/categoria-entity';
//mport { Repository } from 'typeorm';
//mport { ErrorPlantopia } from 'src/comunes/error-plantopia/error-plantopia';
//mport { get } from 'http';
//Injectable()
//xport class ProductosService {
// productos: Producto[] = [];
// constructor(
//   @InjectRepository(Producto)
//   private productoRepository: Repository<Producto>,
// ) {}
//
// async getProducts(): Promise<Producto[]> {
//   const productos = await this.productoRepository.find({
//     relations: ['categoria'],
//   });
//   return productos;
// }
//
// //  async getProducts(): Promise<Producto[]> {
// //    const productos = await this.productoRepository.find({
// //      relations: ['categoria'],
// //    });
// //
// //  }
// //  async getProduct(id: number): Promise<Producto> {
// //    const product = await this.productoRepository.findOne({
// //      where: { id },
// //      relations: ['Macetero', 'Planta', 'Sustrato', 'Fertilizante', 'ControlPlaga']
// //    });
// //
// //    if (!product) {
// //      throw new Error('Producto no encontrado');
// //    }
// //
// //    return product;
// //  }
//
