import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Habitat' })
export class Habitat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
