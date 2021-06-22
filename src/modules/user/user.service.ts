import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import * as _ from 'lodash';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
  ) { }

  async validateAccount(unValidateEmailToken: string) {
    const u = await this.userModel.findOne({ unValidateEmailToken }).lean();
    if (!u) throw new NotFoundException('找不到此用户，请通过发件人联系管理员！');
    else { // @ts-ignore
      if (new Date().getTime() - u.registerTime > 86400000) {
        throw new NotAcceptableException(
          '注册时长超过一天，不允许激活。请通过发件人联系管理员！',
        );
      } else {
        return this.userModel.updateOne(
          { _id: u._id },
          {
            $set: {
              unValidateEmail: false,
            },
          },
        );
      }
    }
  }

  async signUp(user: CreateUserDto): Promise<any> {
    user.avatarUrl = `f${_.random(1, 6)}.jpeg`;
    const model = new this.userModel(user);
    const salt = model.makeSalt();
    model.salt = salt;
    model.password = model.encryptPassword(model.password);
    // model.unValidateEmailToken = this.toolService.getRandomUrlString();
    return await model.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneByName(name: string): Promise<User> {
    return this.userModel.findOne({ name }).lean();
  }

  async findOne(id: string): Promise<User> {
    return this.userModel.findById(id);
    // const cond = {};
    // cond['_id'] = mongoose.Types.ObjectId(id);
    // return this.userModel.findOne(cond).exec();
  }
}
