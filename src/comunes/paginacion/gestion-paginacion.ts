import { Repository } from 'typeorm';

export async function gestionPaginacion<T>(
  repository: Repository<T>,
  page: number,
  size: number,
  relations: string[] = [],
): Promise<{ data: T[]; total: number }> {
  const queryBuilder = repository.createQueryBuilder('producto');

  queryBuilder.where('producto.activo = :activo', { activo: 1 });

  relations.forEach((relation) => {
    queryBuilder.leftJoinAndSelect(`producto.${relation}`, relation);
  });

  queryBuilder.skip((page - 1) * size);
  queryBuilder.take(size);

  const [result, total] = await queryBuilder.getManyAndCount();

  return {
    data: result,
    total,
  };
}
