import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CoberturaDespachoProducto } from './CoberturaDespachoProducto-entity';

@Entity()
export class Comuna {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  nombreComuna: string;

  @OneToMany(() => CoberturaDespachoProducto, (cobertura) => cobertura.comuna)
  coberturas: CoberturaDespachoProducto[];
}
