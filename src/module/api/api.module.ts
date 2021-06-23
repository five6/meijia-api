import { Module, LoggerService, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserController } from './user/user.controller';
import { SysCommonController } from './sys-common/sys-common.controller';

import { UserService } from '../../service/user/user.service';
import { ToolsService } from '../../service/tools/tools.service';

import { UserSchema } from '../../schema/user.schema';
import { AuthModule } from '../common/auth/auth.module';
import { AuthService } from '../common/auth/auth.service';
import { jwtConstants } from '../common/auth/constants';
import { Config } from '../../common/config/config';
import { SysCommonSchema } from '../../schema/sys-common.schema';
import { SysCommonService } from '../../service/sys-common/sys-common.service';
import {ApiAuthMiddleware} from '../../middleware/apiauth.middleware';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema, collection: 'user' },
      { name: 'SysCommon', schema: SysCommonSchema, collection: 'sys-common' },
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: Config.jwtExpireTime },
    }),
    AuthModule,
  ],
  controllers: [UserController, SysCommonController],
  providers: [UserService, ToolsService, AuthService, SysCommonService],
  exports: [],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ApiAuthMiddleware).
       forRoutes(
         { path: '*/api', method: RequestMethod.GET },
        );
  }
 }
