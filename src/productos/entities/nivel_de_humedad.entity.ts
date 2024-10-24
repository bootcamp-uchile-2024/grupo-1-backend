import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Planta } from './planta.entity';

@Entity({ name: 'NivelDeHumedad' })
export class NivelDeHumedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, nullable: false })
  descripcion: string;

  @OneToMany(() => Planta, (planta) => planta.humedad)
  plantas: Planta[];
}
