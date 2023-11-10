import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: Request, res: Response, next: NextFunction) {
    // this.middlewares.log(`${req.ip} ${req.method}`, req.originalUrl)
    // console.log(req.ip)
    // console.log(req.originalUrl)
    res.on('finish', () => {
      this.logger.log(
        `${req.ip} ${req.method} ${res.statusCode}`,
        req.originalUrl,
      );
    });

    next();
  }
}
