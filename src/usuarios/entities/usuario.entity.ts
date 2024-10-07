import { ApiProperty } from '@nestjs/swagger';
import { Planta } from 'src/productos/entities/planta.entity';
export class Usuario {
  @ApiProperty()
  public id: number;
  @ApiProperty()
  public rut: string;
  @ApiProperty()
  public nombre: string;
  @ApiProperty()
  public email: string;
  @ApiProperty()
  public password: string;
  @ApiProperty()
  public telefono: number;
  @ApiProperty()
  public direccion: string;
  @ApiProperty()
  public ciudad: string;
  @ApiProperty()
  public region: string;
  @ApiProperty()
  public comuna: string;
  @ApiProperty()
  public codigoPostal: number;
  @ApiProperty()
  public plantas: Planta[];
  constructor(
    id: number,
    rut: string,
    nombre: string,
    email: string,
    password: string,
    telefono: number,
    direccion: string,
    ciudad: string,
    region: string,
    comuna: string,
    codigoPostal: number,
    plantas: Planta[],
  ) {
    this.id = id;
    this.rut = rut;
    this.nombre = nombre;
    this.email = email;
    this.password = password;
    this.telefono = telefono;
    this.direccion = direccion;
    this.ciudad = ciudad;
    this.region = region;
    this.comuna = comuna;
    this.codigoPostal = codigoPostal;
    this.plantas = plantas;
  }
}
