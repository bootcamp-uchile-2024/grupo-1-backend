import { ApiProperty } from '@nestjs/swagger';
import { Planta } from 'src/plantas/entities/planta.entity';
import { ComunaSantiago } from './comunas.stgo-enum';

export class Usuario {
    constructor(
    public id: number,
    public rut: string,
    public nombre: string,
    public email: string,
    public password: string,
    public telefono: string,
    public direccion: string,
    public ciudad: string,
    public region: string,
    public comunaSantiago: ComunaSantiago,
    public codigoPostal: string,
    public plantas: Planta[],
  ) {}
 }

