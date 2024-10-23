import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TipoPlantasRecomendadas' })
export class TipoPlantasRecomendadas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  descripcion: string;
}
