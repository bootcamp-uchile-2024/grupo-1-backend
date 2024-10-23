import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Categoria' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombreCategoria: string;
}
