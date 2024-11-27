import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class GlobalMiddlewareMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('MIDDLEWARE - Path del Request:', req.originalUrl);
    console.log('MIDDLEWARE - Metodo de Request: ', req.method);
    /*
    // Verificar que no interrumpas el flujo cuando se suben archivos
    if (req.method === 'POST' || req.method === 'PATCH') {
      // Si el contenido es multipart/form-data
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        console.log('MIDDLEWARE - Solicitud POST/PATCH con archivo');
      } else {
        // Verificar si el cuerpo está vacío (para POST sin archivos)
        if (!req.body || Object.keys(req.body).length === 0) {
          return res
            .status(401)
            .send({ message: 'MIDDLEWARE - No autorizado(Sin body Post)' });
        } else {
          console.log('MIDDLEWARE - Body de Request: ', req.body);
        }
      }
    }

    // Verificar parámetros en el caso de solicitudes GET
    if (req.method === 'GET') {
      if (req.query && Object.keys(req.query).length > 0) {
        console.log('MIDDLEWARE - Query Params: ', req.query);
      }
    }
*/
    // No olvides siempre llamar a `next()` para pasar al siguiente middleware o controlador
    next();
  }
}
