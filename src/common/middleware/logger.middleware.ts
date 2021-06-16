import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import { pick, omit } from 'lodash';

const pwcFormat = format.printf(({ level, message, meta, timestamp }) => {
  const _meta = meta
    ? JSON.stringify(
      omit(meta, [
        // 'req.headers.jwt',
        'req.headers.cookie',
        'req.method',
        'req.httpVersion',
        'req.url',
      ]),
      null,
      4,
    )
    : '';
  return `${timestamp} ${level}: ${message} ${_meta}`;
});

const loggerFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  pwcFormat,
);

const logPath = `${__dirname}/../../../logs`;

export const logger = createLogger({
  format: loggerFormat,
  transports: [
    new transports.DailyRotateFile({
      filename: `${logPath}/app.%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '7d',
      level: 'info',
    }),
    new transports.DailyRotateFile({
      filename: `${logPath}/errors.%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '100m',
      maxFiles: '14d',
      level: 'error',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: `${logPath}/exceptions.log` }),
  ],
});

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    logger.log({
      level: 'info',
      message: 'req',
      meta: {
        req: pick(req, [
          'baseUrl',
          'body',
          'headers',
          'host',
          'hostname',
          'httpVersion',
          'ip',
          'method',
          'originalUrl',
          'params',
          'path',
          'protocol',
          'query',
          'url',
        ]),
        // res: pick(res, []),
      },
    });
    next();
  }
}
