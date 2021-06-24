import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { AdminModule } from './module/admin/admin.module';
import { ApiModule } from './module/api/api.module';
import { FilesModule } from './module/common/file/files.module';
import { LoggerModule } from './module/common/logger/logger.module';
import { PublicModule } from './module/common/public/public.module';
@Module({
  imports: [PublicModule, AdminModule, ApiModule, FilesModule, LoggerModule],
  controllers: [AppController],
  providers: [],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
