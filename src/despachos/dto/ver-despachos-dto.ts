import { EstadosDespacho } from '../entities/estados_despacho.entity';

export class VerDespachos {
  public fechaEstimada: Date;
  public EstadosDespacho: EstadosDespacho;
  public nroSeguimiento: number;
  public proveedorDespacho: string; /*se deberia crear entidaad proveedor */
}
