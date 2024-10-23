import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'FormaMacetero' })
export class FormaMacetero {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  descripcion: string;
}
