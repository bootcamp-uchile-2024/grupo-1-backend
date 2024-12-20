import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

const logger = new Logger('GestionPaginacion');

export async function gestionPaginacion<T>(
  repository: Repository<T>,
  page: number,
  size: number,
  relations: string[] = [],
): Promise<{ data: T[]; total: number }> {
  logger.log(`Iniciando paginación: página ${page}, tamaño ${size}`);
  logger.debug(`Relaciones solicitadas: ${relations.join(', ') || 'Ninguna'}`);

  // Validaciones iniciales
  if (page <= 0 || size <= 0) {
    logger.warn(
      `Parámetros de paginación inválidos: página ${page}, tamaño ${size}`,
    );
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        message: 'Los parámetros de paginación deben ser mayores a 0.',
        details: { page, size },
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  const queryBuilder = repository.createQueryBuilder('producto');

  try {
    queryBuilder.where('producto.activo = :activo', { activo: 1 });
    logger.debug('Filtrando productos activos');

    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`producto.${relation}`, relation);
      logger.debug(`Uniendo relación: ${relation}`);
    });

    queryBuilder.skip((page - 1) * size);
    queryBuilder.take(size);
    logger.debug(
      `Aplicando paginación: skip ${(page - 1) * size}, take ${size}`,
    );

    const [result, total] = await queryBuilder.getManyAndCount();
    logger.log(
      `Paginación completada: ${result.length} resultados encontrados, total de registros: ${total}`,
    );
    logger.debug(`Datos retornados: ${JSON.stringify(result, null, 2)}`);

    return {
      data: result,
      total,
    };
  } catch (error) {
    // Control de errores con mensajes claros
    logger.error(
      `Error durante la ejecución de la consulta de paginación: página ${page}, tamaño ${size}`,
      error.stack,
    );

    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Ocurrió un error al procesar la paginación.',
        details: {
          error: error.message,
          page,
          size,
          relations,
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
