import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from './producto.entity';
@Entity({ name: 'Categoria' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreCategoria: string;
  @OneToMany(() => Producto, (producto) => producto.categoria)
  productos: Producto[];
}
