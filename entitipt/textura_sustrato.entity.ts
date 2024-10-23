import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'TexturaSustrato' })
export class TexturaSustrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  descripcion: string;
}
