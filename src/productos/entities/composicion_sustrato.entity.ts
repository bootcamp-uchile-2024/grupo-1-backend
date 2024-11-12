import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ComposicionSustrato' })
export class ComposicionSustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
