import { Injectable } from '@nestjs/common';
import { CreateMaceteroDto } from '../dto/create-macetero.dto';
import { CreatePlantaDto } from '../dto/create-planta.dto';
import { CreateControlPlagasDto } from '../dto/create-control-plagas.dto';
import { ErrorPlantopia } from 'src/comunes/error-plantopia/error-plantopia';
import { Producto } from 'src/productos/entities/producto.entity';
import { CreateFertilizanteDto } from '../dto/create-fertilizante.dto';
import { CreateSustratoDto } from '../dto/create-sustrato.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class ProductosService {
  productos: Producto[] = [];
  constructor(
    @InjectRepository(Producto)
    private productoRepository: Repository<Producto>,
  ) { }

  // CATALOGO de productos
  // busca todos los productos
  async findallcatalogo(): Promise<Producto[]> {
    console.log('entro al servicio catalogo de producto ');
    const productos = await this.productoRepository.find({
      relations: ['categoria'],
    });
    return productos;
  }

  // busca un producto por su id
  async porProducto(id: number): Promise<Producto[]> {
    const tipoProducto = await this.productoRepository.find({where: {id},relations:['categoria']});
    let categoriax=tipoProducto[0].categoria.id;
    let producto;

    if(categoriax == 1){
       producto = await this.productoRepository.find({ where:{id},relations:['categoria','planta','imagenes','planta.estaciones'] });
    }else if(categoriax == 2){
       producto = await this.productoRepository.find({ where:{id},relations:['categoria','controlplaga','imagenes'] });
    }else if(categoriax == 3){
     producto = await this.productoRepository.find({ where:{id},relations:['categoria','macetero','imagenes'] });
    }else if(categoriax == 4){
       producto = await this.productoRepository.find({ where:{id},relations:['categoria','sustrato','imagenes'] });
    }else if(categoriax == 5){
        producto = await this.productoRepository.find({ where:{id},relations:['categoria','fertilizante','imagenes'] });
    }
   
    return producto;
  }
}


