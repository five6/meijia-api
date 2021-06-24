import { Module } from '@nestjs/common';
import { MjLogger } from '../../../service/logger/logger.service';

@Module({
  providers: [MjLogger],
  exports: [MjLogger],
})
export class LoggerModule {}
