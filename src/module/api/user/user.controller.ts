import { Controller, Get, Param, Query, Post, Body, Request, UnauthorizedException, Logger, UseGuards, Response, Session } from '@nestjs/common';

import { UserService } from '../../../service/user/user.service';
import { Pagination } from '../../../common/result-beans/Pagination';
import { ResultPagination } from '../../../common/result-beans/ResultPagination';
import { AuthService } from '../../common/auth/auth.service';
import { Result } from '../../../common/result-beans/Result';
import { AuthGuard } from '@nestjs/passport';
import * as _ from 'lodash';
import { ToolsService } from '../../../service/tools/tools.service';
import { Config } from '../../../common/config/config';

@Controller('frontend/users')
export class UserController {
  logger = new Logger();
  constructor(private userService: UserService, private authService: AuthService, private toolService: ToolsService) {}
  @Get('captcha')
  index(@Request() req, @Response() res) {
      const captcha = this.toolService.getCaptcha();
      req.session.code = captcha.text;
      res.type('image/svg+xml');
      res.send(captcha.data);
  }

  @Get('validate/account/:id')
  async validateAccount(@Param('id') unValidateEmailToken: string, @Response() res) {
      await this.userService.validateAccount(unValidateEmailToken);
      res.end('success!');
  }

  @Post('signin')
  async login(@Body() body, @Session() session): Promise<Result> {
    if (body.captcha !== session.code) {
      return {
        datas: null,
        code: -1,
        msg: '验证码不正确！',
      };
    }
    const user = await this.userService.findOne({username: body.username, password: body.password});
    if (!user) {
      return {
        datas: null,
        code: -1,
        msg: '用户名不存在或密码错误！',
      };
    } else if (user.locked) {
        return {
          datas: null,
          code: -1,
          msg: '用户已被锁定，禁止登录',
        };
    }  else if (user.unValidateEmail) {
      return {
        datas: null,
        code: -1,
        msg: '用户尚未激活，请激活后重试',
      };
    }
    const obj = await this.authService.signin(user);
    if (obj && obj.access_token) {
      const ret = await this.userService.update({_id: user._id, jwtToken: obj.access_token});
      return {
        datas: obj.access_token,
        code: 0,
        msg: '登录成功',
      };
    }
    return {
        datas: null,
        code: -1,
        msg: '登录失败',
    };
  }

  @Post('signup')
  async signup(@Body() user, @Session() session) {
    if (user.captcha !== session.code) {
      return {
        datas: null,
        code: -1,
        msg: '验证码不正确！',
      };
    }
    const u =  await this.userService.signup(user);
    if (u) {
      await this.toolService.sendEmailToUser(user.email, user.username, user.password, `${Config.HTTP_SERVER}/${Config.API_PREFIX}/frontend/users/validate/account/${u.unValidateEmailToken}`);
      return new Result({
        datas: {
          username: u.username,
          // password: user.password,
          email: u.email,
        },
        code: 0,
        msg: '注册成功',
      });
    }
    return new Result({
      datas: null,
      code: -1,
      msg: '注册失败',
    });
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async currentUser(@Request() req): Promise<Result> {
    const user = await this.userService.findOne({username: req.user.username, password: req.user.password});
    return {
      datas: user ? _.omit(user.toJSON(), ['password', 'salt']) : null,
      code: user ? 0 : -1,
      msg:  user ? '获取用户信息成功！' : '获取用户信息失败',
    };
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async find(@Query() query: any, @Query('pageSize') pageSize?: number, @Query('currentPage') currentPage?: number) {
    const fields = '';
    const cond = {
        username: query.username,
    };
    if (!query.username) {
        delete cond.username;
    }
    const items = await this.userService.find(cond, fields, new Pagination({currentPage, pageSize}));
    return  new ResultPagination({
      items: _.map(items[0], user => {
        return _.omit(user, ['salt', 'password']);
      }),
      totalCount: items[1],
      code: 0,
      msg: '获取用户信息成功',
    });
  }

  @Get('check/authorized')
  @UseGuards(AuthGuard('jwt'))
  async checkUserAuthorized() {
    return {
      datas: null,
      code: 0,
      msg: '用户获取成功',
    };
  }
}
