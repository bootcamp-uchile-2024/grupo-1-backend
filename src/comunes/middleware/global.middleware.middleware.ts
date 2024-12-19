import { Injectable, NestMiddleware } from '@nestjs/common';
import { Logger } from '@nestjs/common';

@Injectable()
export class GlobalMiddlewareMiddleware implements NestMiddleware {
  private readonly logger = new Logger(GlobalMiddlewareMiddleware.name);

  use(req: any, res: any, next: () => void) {
    this.logger.verbose('Path del Request: ' + req.originalUrl);
    this.logger.verbose('Metodo de Request: ' + req.method);

    if (req.method === 'POST' || req.method === 'PATCH') {
      if (req.headers['content-type']?.includes('multipart/form-data')) {
        this.logger.verbose('Solicitud POST/PATCH con archivo');
      } else {
        if (!req.body || Object.keys(req.body).length === 0) {
          return res
            .status(401)
            .send({ message: 'No autorizado(Sin body Post)' });
        } else {
          this.logger.verbose('Body de Request: ' + JSON.stringify(req.body));
        }
      }
    }
    if (req.method === 'GET') {
      if (req.query && Object.keys(req.query).length > 0) {
        this.logger.verbose('Query Params: ' + JSON.stringify(req.query));
      }
    }
    next();
  }
}
