import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as mongoose from 'mongoose';
@Injectable()
export class UserService {
  //register new user
  signup(): any {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

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
