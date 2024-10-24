import { Entity, PrimaryGeneratedColumn, Column, OneToMany,OneToOne,JoinColumn,ManyToMany,JoinTable, } from 'typeorm';
import { Producto } from 'src/productos/entities/producto.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Entity()
export class Servicio {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => Producto, (producto) => producto.servicio)
  @JoinColumn({ name: 'idProducto' })
  producto: Producto;

  @Column({ type: 'varchar', length: 255, nullable: true })
  nombre: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  descripcion: string;
  @ManyToMany(() => Usuario)
  @JoinTable({
      name: 'ServicioUsuario', 
      joinColumn: {
          name: 'idServicio', 
          referencedColumnName: 'id',
      },
      inverseJoinColumn: {
          name: 'idUsuario', 
          referencedColumnName: 'id', 
      },
  })
  usuarios: Usuario[];
 
}
