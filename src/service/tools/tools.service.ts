import { Injectable, Logger } from '@nestjs/common';
import * as svgCaptcha from 'svg-captcha';
import * as crypto from 'crypto';
import { CryptoRandomStringType } from '../../common/enum/CryptoRandomStringType';
import cryptoRandomString from 'crypto-random-string';
import * as _ from 'lodash';
import * as nodemailer from 'nodemailer';
import { Config } from '../../common/config/config';

@Injectable()
export class ToolsService {
    logger = new Logger();
    transporter = null;
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'qq',
            port: 465, // SMTP 端口
            ssl: false, // 使用 SSL
            auth: {
                user: Config.MAIL_CONF.user,
                pass: Config.MAIL_CONF.pass,
            },
        });
    }

    getCaptcha() {
        return svgCaptcha.create({
            size: 4,
            fontSize: 50,
            width: 100,
            height: 40,
            background: '#d8c0ff',
        });
    }
    getMd5(str: string) {
        return crypto.createHash('md5').update(str).digest('hex');
    }
    getRandomUrlString() {
        // @ts-ignore
        return cryptoRandomString({length: 64, type: CryptoRandomStringType.urlSsafe});
    }
    async sendEmail(mail: string, title: any, body: any) {
        const info = {
            from: Config.MAIL_CONF.user, // sender address
            to: mail, // list of receivers
            subject: title, // Subject line
            html: body, // html body
        };
        return new Promise((resolve, reject) => {
            // tslint:disable-next-line:no-shadowed-variable
            this.transporter.sendMail(info, (err, info ) => {
                if (err) {
                    reject(err);
                }
                resolve(info);
            });
        });
    }
    async sendEmailToUser(mail: string, username: string, password: string, url: string) {
        const tplTitle = _.template('用户注册结果');
        const tplBody = `<p>恭喜您注册成功!<br /> 用户名是${username}、密码是${password},请点击下面链接完成验证，链接有效期24小时<br /> ${url}</p>`;
        const dataTitle = {platform : tplTitle};
        const result = await this.sendEmail(mail, tplTitle(dataTitle), tplBody).catch(err => {
            this.logger.error(err);
        });
        if (result) { this.logger.log('Email send success! (' + mail + ')'); }
    }
}
