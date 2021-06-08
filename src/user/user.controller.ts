import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { User } from '../schema/user.schema';
import { UserService } from './user.service';

@Controller('users')
@ApiTags('用户接口')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }
}
