import {Body, Controller, Get, Param, Post, Request} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { User } from './user.schema';
import { UserService } from './user.service';
import {CreateCatDto} from "../../../../nestjs/sample/06-mongoose/src/cats/dto/create-cat.dto";
import {CreateUserDto} from "./dto/create-user.dto";

@Controller('api/v1/users')
@ApiTags('用户接口')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.signUp(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.userService.findOne(id);
  }
}
