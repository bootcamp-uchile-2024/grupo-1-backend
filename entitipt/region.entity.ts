import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Region' })
export class Region {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;
}
