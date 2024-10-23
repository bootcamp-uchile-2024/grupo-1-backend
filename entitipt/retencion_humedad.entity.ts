import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'RetencionHumedad' })
export class RetencionHumedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
