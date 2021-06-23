import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { UserService } from '../../service/user/user.service';

import { UserSchema } from '../../schema/user.schema';
import { ToolsService } from '../../service/tools/tools.service';
import { AdminauthMiddleware } from '../../middleware/adminauth.middleware';
import { UserController } from './user/user.controller';
import { SysCommonSchema } from '../../schema/sys-common.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'SysCommon', schema: SysCommonSchema, collection: 'sys-common' },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, ToolsService],
  exports: [UserService],
})
export class AdminModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AdminauthMiddleware)
      .exclude(
        { path: 'api/v1/admin/users/login', method: RequestMethod.POST },
        { path: 'api/v1/admin/users/captcha', method: RequestMethod.GET },
      )
      /***
       * forRoutes可以使用 controller 也可使用path
       * forRoutes({ path: 'cats', method: RequestMethod.GET });
       */
      .forRoutes(UserController);
  }
}
