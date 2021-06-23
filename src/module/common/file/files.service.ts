import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { MongoGridFS } from 'mongo-gridfs';
import { GridFSBucketReadStream } from 'mongodb';
import { File } from '../../../common/result-beans/File';
import * as mongoose from 'mongoose';
import { Config } from '../../../common/config/config';

@Injectable()
export class FilesService {

    private fileModel: MongoGridFS;

    constructor() {
      mongoose.createConnection(Config.MONGO_FILES, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }).then(r => {
        this.fileModel = new MongoGridFS(r.db, 'fs');
      });
    }

  async readStream(id: string): Promise<GridFSBucketReadStream> {
    return await this.fileModel.readFileStream(id);
  }

  async find(id: string): Promise<File> {
    const result = await this.fileModel
      .findById(id).catch(err => {
          throw new HttpException('File not found', HttpStatus.NOT_FOUND);
        } )
      .then(result => result);
    return {
        filename: result.filename,
        length: result.length,
        chunkSize: result.chunkSize,
        md5: result.md5,
        contentType: result.contentType,
    };
  }

  async deleteFile(id: string): Promise<boolean> {
    return await this.fileModel.delete(id);
  }
  async check(id: string): Promise<File> {
    return await this.fileModel.findOne(id);
  }
}
