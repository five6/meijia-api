import { Controller, Get, Param, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from './user.interface';
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
    async findOne(@Param('id') id: Number): Promise<User> {
        return this.userService.findOne(id);
    }

}
