import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Perfil' })
export class Perfil {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'boolean' })
  accesoSistema: boolean;
}
