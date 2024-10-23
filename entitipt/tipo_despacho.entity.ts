import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TipoDespacho' })
export class TipoDespacho {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombreMetodo: string;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
