import { RedisModule} from 'nestjs-redis';
import { Module } from '@nestjs/common';
import { Config } from '../../../common/config/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
        // RedisModule.register(Config.redisOptions),
        MongooseModule.forRoot(Config.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true }),
    ],
    providers: [],
    exports: [],
})
export class PublicModule {}
