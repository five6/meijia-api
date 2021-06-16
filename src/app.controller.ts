import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('主页')
@Controller('/api/v1')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/echo')
  echo(): string {
    return this.appService.echo();
  }
}
