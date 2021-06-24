import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { GridFsStorage } from 'multer-gridfs-storage';
import { Config } from '../../../common/config/config';
@Injectable()
export class GridFsMulterConfigService implements MulterOptionsFactory {
    gridFsStorage: any;
    constructor() {
        this.gridFsStorage = new GridFsStorage({
            url: Config.MONGO_FILES,
            file: (req, file) => {
                return new Promise((resolve, reject) => {
                    const filename = file.originalname.trim();
                    const fileInfo = {
                      filename,
                    };
                    resolve(fileInfo);
                });
              },
        });
    }

    createMulterOptions(): MulterModuleOptions {
        return {
            storage: this.gridFsStorage,
        };
    }
}
