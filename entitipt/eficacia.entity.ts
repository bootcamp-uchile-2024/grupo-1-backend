import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Eficacia' })
export class Eficacia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
