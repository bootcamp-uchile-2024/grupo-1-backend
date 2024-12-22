import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Usuario } from './usuario.entity';

@Entity('preferencias')
export class Preferencias {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  respuesta1: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta2: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta3: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta4: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta5: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta6: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta7: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta8: string;

  @Column({ type: 'varchar', length: 255 })
  respuesta9: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.Preferencias)
  usuario: Usuario;
}
