import { Logger } from '@nestjs/common';
import { logger } from '../../middleware/logger.middleware';

// @Injectable({ scope: Scope.TRANSIENT })
export class MjLogger extends Logger {
  log(message: string) {
    logger.info(message);
    super.log(message);
  }

  error(message: string, trace: string) {
    logger.error(message, trace);
    super.error(message, trace);
  }

  warn(message: string) {
    logger.warn(message);
    super.warn(message);
  }

  debug(message: string) {
    logger.debug(message);
    super.debug(message);
  }

  verbose(message: string) {
    logger.verbose(message);
    super.verbose(message);
  }
}
