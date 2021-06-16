import { Module } from '@nestjs/common';
import { CMLogger } from './logger.service';

@Module({
  providers: [CMLogger],
  exports: [CMLogger],
})
export class LoggerModule {}
