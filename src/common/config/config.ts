export class Config {

  // 文件上传保存地址
  static uploadDir = 'upload';

  // 统一接口前缀
  static API_PREFIX = 'api/v1';

  // 数据库
  static MONGO_DB = 'mongodb://localhost/meijia';

  // 文件数据库
  static MONGO_FILES = 'mongodb://localhost/meijia_files';

  // jwt过期时间
  static jwtExpireTime = '1d';

  // 邮件发送地址
  static MAIL_CONF = {
    user: '936333511@qq.com',
    pass: 'xdcuxzvtylkkbfhb',
  };
  static HTTP_SERVER = 'http://127.0.0.1:7000';

  static redisOptions = {
    port: 6379,
    host: '127.0.0.1',
    password: '',
    db: 0,
  };
}
