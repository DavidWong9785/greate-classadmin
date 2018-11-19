'use strict';
const Service = require('egg').Service;

class registerCodeService extends Service {
    async index(mail) {
        const { ctx, app } = this;
        const code = ctx.helper.getMailAuthcode();
        // console.log(mail);
        const mailId = await ctx.service.authcode.registerCodeService.sendMail(code, mail);
        // 把验证码和信息存到redis
        const redisJson = JSON.stringify({
            code,
            dateTime: new Date().getTime(),
            mailId,
        });
        await app.redis.get('registercode').del(mail + '');
        await app.redis.get('registercode').set(mail + '', redisJson);
        return;
    }
    async sendMail(code, mail) {
        const { ctx } = this;
        const mailId = await ctx.helper.mailSend(code, mail);
        return mailId;
    }
}

module.exports = registerCodeService;
