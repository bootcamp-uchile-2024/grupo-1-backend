import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Despacho } from './despacho.entity';

@Entity({ name: 'TipoDespacho' })
export class TipoDespacho {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombreMetodo: string;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
  @OneToMany(() => Despacho, (despacho) => despacho.tipoDespacho)
  despachos: Despacho[];
}
