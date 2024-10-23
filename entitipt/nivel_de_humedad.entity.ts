import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'NivelDeHumedad' })
export class NivelDeHumedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
