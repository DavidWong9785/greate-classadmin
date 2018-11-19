'use strict';
const Service = require('egg').Service;

class superAdminLoginService extends Service {
    async index(userId, pass) {
        const { ctx, app } = this;
        try {
            const admin = await ctx.model.Admin.checkAdmin(userId);
            // 找不到
            if (admin == null) {
                return '0';
            }
            const dataValues = admin.dataValues;
            // 不匹配
            if (dataValues.password !== pass) {
                return '0';
            }
            // 被锁
            if (dataValues.status === '0') {
                return '2';
            }
            // 把加密过的鉴权cookie写入客户端
            const result = ctx.helper.encryptLoginCookies(userId);
            // await ctx.session.userId = result;
            await ctx.cookies.set('EGG_ADMIN', result, {
                maxAge: 24 * 3600 * 1000 * 1,
                httpOnly: true,
            });
            // 把鉴权cookie的hash值写入redis，用于登陆后操作的鉴权
            await app.redis.get('loginkey').del(userId);
            await app.redis.get('loginkey').set(userId, result);

            const clientData = {
                userId: dataValues.userId,
            };
            return clientData;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    // 已经登录，获取基本数据
    async adminhavebeenlogin(userId) {
        const { ctx } = this;
        const { dataValues } = await ctx.model.Admin.checkAdmin(userId);
        const clientData = {
            userId: dataValues.userId,
            username: dataValues.username,
            avatar: dataValues.avatar,
            access: dataValues.access,
        };
        return clientData;
    }
}

module.exports = superAdminLoginService;
