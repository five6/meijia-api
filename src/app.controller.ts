import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './module/common/auth/guards/jwt-auth.guard';
import { MjLogger } from './service/logger/logger.service';

@Controller()
// @UseGuards(JwtAuthGuard)
export class AppController {
  constructor(private loggerService: MjLogger) {}

  @Get('')
  getHello(): string {
    this.loggerService.log(process.env.NODE_ENV);
    return process.env.NODE_ENV;
  }
}
