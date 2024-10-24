import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrdenCompra } from './orden_compra.entity';

@Entity({ name: 'EstadosOC' })
export class EstadosOC {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;

  @OneToMany(() => OrdenCompra, (orden) => orden.estado)
  ordenesCompra: OrdenCompra[];
}
