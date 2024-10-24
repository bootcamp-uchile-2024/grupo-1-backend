import { Entity, Column, PrimaryGeneratedColumn , ManyToMany} from 'typeorm';
import { ControlPlaga } from './control_plaga.entity';

@Entity({ name: '' })
export class FormaAplicacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @ManyToMany(() => ControlPlaga, (controlplaga) => controlplaga.formaaplica)
  controlplagas: ControlPlaga[];
}
