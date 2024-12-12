import { SetMetadata } from "@nestjs/common";
import { Rol } from "src/enum/rol.enum";

export const CLAVE = 'ROLES_AUTORIZADOS';
export const RolesAutorizados = (...params: Rol[]) => 
  SetMetadata(CLAVE, params);