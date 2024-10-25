import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Producto } from './producto.entity'; // Ajusta la ruta según tu estructura de carpetas

@Entity()
export class Imagen {
  @PrimaryGeneratedColumn()
  public idImagen: number;

  @Column({ type: 'varchar', length: 255 })
  public url: string; // URL de la imagen

 /* @ManyToOne(() => Producto, (producto) => producto.imagenes)
  public producto: Producto; // Relación con la entidad Producto*/
}