import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Plaga' })
export class Plaga {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;
}
