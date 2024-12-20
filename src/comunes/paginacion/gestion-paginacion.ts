import { Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';

const logger = new Logger('GestionPaginacion');

export async function gestionPaginacion<T>(
  repository: Repository<T>,
  page: number,
  size: number,
  relations: string[] = [],
): Promise<{ data: T[]; total: number }> {
  logger.log({
    message: `Iniciando paginación: página ${page}, tamaño ${size}`,
    context: 'GestionPaginacion',
  });
  logger.debug({
    message: `Relaciones solicitadas: ${relations.join(', ') || 'Ninguna'}`,
    context: 'GestionPaginacion',
  });

  if (page <= 0 || size <= 0) {
    logger.warn({
      message: `Parámetros de paginación inválidos: página ${page}, tamaño ${size}`,
      context: 'GestionPaginacion',
    });
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
    logger.debug({
      message: 'Filtrando productos activos',
      context: 'GestionPaginacion',
    });

    relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(`producto.${relation}`, relation);
      logger.debug({
        message: `Uniendo relación: ${relation}`,
        context: 'GestionPaginacion',
      });
    });

    queryBuilder.skip((page - 1) * size);
    queryBuilder.take(size);
    logger.debug({
      message: `Aplicando paginación: skip ${(page - 1) * size}, take ${size}`,
      context: 'GestionPaginacion',
    });

    const [result, total] = await queryBuilder.getManyAndCount();
    logger.log({
      message: `Paginación completada: ${result.length} resultados encontrados, total de registros: ${total}`,
      context: 'GestionPaginacion',
    });
    logger.debug({
      message: `Datos retornados: ${JSON.stringify(result, null, 2)}`,
      context: 'GestionPaginacion',
    });

    return {
      data: result,
      total,
    };
  } catch (error) {
    logger.error({
      message: `Error durante la ejecución de la consulta de paginación: página ${page}, tamaño ${size}`,
      context: 'GestionPaginacion',
      stack: error.stack,
    });

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
