// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.resolve(__dirname, './.env') });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CMLogger } from './modules/logger/logger.service';
import * as compression from 'compression';
import * as helmet from 'helmet';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new CMLogger(),
  });

  app.use(compression());
  app.use(helmet());

  // app.setGlobalPrefix(`${process.env.APP_NAME}/api`);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('api接口文档')
    .setDescription('api接口文档列表')
    .setVersion('1.0')
    .addTag('')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
