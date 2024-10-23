import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Region } from './region.entity';

@Entity({ name: 'Comuna' })
export class Comuna {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Region)
  @JoinColumn({ name: 'idRegion' })
  region: Region;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;
}
