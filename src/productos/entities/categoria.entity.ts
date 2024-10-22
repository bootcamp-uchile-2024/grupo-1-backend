import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Categoria' })
export class Categoria {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ name: 'nombreCategoria', type: 'varchar', length: 255 })
  nombreCategoria: string;
  constructor(nombreCategoria: string) {
    this.nombreCategoria = nombreCategoria;
  }
}