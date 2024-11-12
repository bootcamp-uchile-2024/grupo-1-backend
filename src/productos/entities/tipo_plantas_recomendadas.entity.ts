import { Entity, Column, PrimaryGeneratedColumn, JoinTable } from 'typeorm';

@Entity({ name: 'TipoPlantasRecomendadas' })
export class TipoPlantasRecomendadas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  descripcion: string;

  @JoinTable({
    name: 'FertilizanteTipoPlantas', // Nombre de la tabla intermedia
    joinColumn: {
      name: 'idFertilizante', // Nombre de la columna en la tabla intermedia que referencia a ControlPlaga
      referencedColumnName: 'id', // Columna de ControlPlaga
    },
    inverseJoinColumn: {
      name: 'idTipoPlanta', // Nombre de la columna en la tabla intermedia que referencia a FormaAplicacion
      referencedColumnName: 'id', // Columna de FormaAplicacion
    },
  })
  suelos: TipoPlantasRecomendadas[];
  fertilizantes: any;
}
