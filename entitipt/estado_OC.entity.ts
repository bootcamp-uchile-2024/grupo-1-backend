import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'EstadosOC' })
export class EstadosOC {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
