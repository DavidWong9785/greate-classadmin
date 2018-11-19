'use strict';
const Service = require('egg').Service;

class userRegisterService extends Service {
    async index({ mail, password, username, authcode }) {
        const { ctx, app } = this;
        // 先判断验证码
        let redisContent = await app.redis.get('registercode').get(mail);
        if (redisContent != null) {
            redisContent = JSON.parse(redisContent);
            // 验证码是否过期
            if (new Date().getTime() - redisContent.dateTime > 600000) {
                return '0';
            }
            const euqalsTag = redisContent.code === authcode ? '1' : '0';
            if (euqalsTag === '1') {
                await ctx.service.user.userRegisterService.addUserInfo(mail, password, username);
                return '1';
            }
            // 验证码不匹配
            return '0';
        }
        // 0为验证码错误
        return '0';
    }
    // 检查用户是否已经注册
    async checkUser(mail) {
        const { ctx } = this;
        const p = await ctx.model.User.checkUser(mail);
        return p;
    }
    // 检查用户名是否已经存在
    async checkUsername(username) {
        const { ctx } = this;
        const p = await ctx.model.User.checkUsername(username);
        return p;
    }
    async addUserInfo(mail, pass, username) {
        const { ctx, app } = this;
        const p = await ctx.model.User.addUser(mail, pass, username);
        await app.redis.get('registercode').del(mail + '');
        return p;
    }
}

module.exports = userRegisterService;
