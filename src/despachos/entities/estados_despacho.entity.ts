import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Despacho } from './despacho.entity';

@Entity({ name: 'EstadosDespacho' })
export class EstadosDespacho {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;

  @OneToMany(() => Despacho, (despacho) => despacho.estadoDespacho)
  despachos: Despacho[];
}
