import { Injectable, Get, Logger, UseGuards, Request, Post, LoggerService, NotFoundException, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from '../../dto/user.dto';
import { User } from '../../interface/user.interface';
import { Pagination } from '../../common/result-beans/Pagination';
import { ToolsService } from '../tools/tools.service';
import * as _ from 'lodash';

@Injectable()
export class UserService {

  logger = new Logger();
  constructor(@InjectModel('User') private readonly userModel, private toolService: ToolsService) { }

  async validateAccount(unValidateEmailToken: string) {
    const u = await this.userModel.findOne({ unValidateEmailToken }).lean();
    if (!u) throw new NotFoundException('找不到此用户，请联系管理员！');
    else if (new Date().getTime() - u.registerTime > 86400000) {
      throw new NotAcceptableException('注册时长超过一天，不允许激活。请联系管理员！');
    } else {
      return await this.userModel.updateOne({ _id: u._id }, {
        $set: {
          unValidateEmail: false,
        },
        // 取消
        // $unset:{ 'unValidateEmailToken':''}
      });
    }
  }

  async findOne(user: any) {
    const u = await this.userModel.findOne({ $or: [{ username: user.username }, { email: user.username }] }).exec();
    if (u && u.authenticate(user.password)) {
      return u;
    }
    return false;
  }

  async find(json: User = {}, fields: string = '', pagination: Pagination) {
    try {
      const skip = (pagination.currentPage - 1) * pagination.pageSize;
      return await Promise.all([
        this.userModel.find(json, fields).skip(skip).limit(pagination.pageSize).lean(),
        this.userModel.countDocuments(json).lean(),
      ]);
    } catch (error) {
      this.logger.error(error);
      return [[], 0];
    }
  }

  async signup(userDto: UserDto) {
    userDto.avatarUrl = `f${_.random(1, 6)}.jpeg`;
    const model = this.userModel(userDto);
    const salt = model.makeSalt();
    model.salt = salt;
    model.password = model.encryptPassword(model.password);
    model.unValidateEmailToken = this.toolService.getRandomUrlString();
    return await model.save();
  }

  async getUserByToken(token: string) {
    const user = await this.userModel.findOne({ jwtToken: token.replace('Bearer ', '') }).lean();
    if (user) {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        nickName: user.nickName,
        avatarUrl: user.avatarUrl,
        registerTime: user.registerTime,
        useDefaultAvatarUrl: user.useDefaultAvatarUrl,
      };
    }
    return null;
  }

  async update(userDto: any) {
    return await this.userModel.updateOne({ _id: userDto._id }, { $set: userDto });
  }

  getById(userId: any): any {
    throw new Error('Method not implemented.');
  }

}