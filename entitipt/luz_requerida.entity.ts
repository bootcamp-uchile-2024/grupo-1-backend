import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'LuzRequerida' })
export class LuzRequerida {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
