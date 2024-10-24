import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Comuna } from './comuna.entity';

@Entity({ name: 'Ciudad' })
export class Ciudad {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Comuna)
  @JoinColumn({ name: 'idComuna' })
  comuna: Comuna;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;
}
