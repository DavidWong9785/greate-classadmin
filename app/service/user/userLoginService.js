'use strict';
const Service = require('egg').Service;

class userLoginService extends Service {
    async index(mail, pass, unLoginTag) {
        const { ctx, app } = this;
        // console.log('mail' + mail);
        try {
            const user = await ctx.model.User.checkUser(mail);
            if (user == null) {
                return '0';
            }
            const dataValues = user.dataValues;
            if (dataValues.password !== pass) {
                return '0';
            }
            const result = ctx.helper.encryptLoginCookies(mail);
            if (unLoginTag) {
                await ctx.cookies.set('EGG_CHECK', result, {
                    maxAge: 24 * 3600 * 1000 * 7,
                    httpOnly: true,
                });
            } else {
                await ctx.cookies.set('EGG_CHECK', result, {
                    maxAge: 0,
                    httpOnly: true,
                });
            }
            await app.redis.get('loginkey').del(mail);
            await app.redis.get('loginkey').set(mail, result);

            const clientData = {
                username: dataValues.username,
                avatar: dataValues.avatar,
                sex: dataValues.sex,
                tag: dataValues.tag,
                learning: dataValues.learning,
            };
            return clientData;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    }

    async haveBeenLogin(mail) {
        const { ctx } = this;
        // 先判断验证码
        console.log(mail);
        const { dataValues } = await ctx.model.User.checkUser(mail);
        const clientData = {
            username: dataValues.username,
            avatar: dataValues.avatar,
            sex: dataValues.sex,
            tag: dataValues.tag,
            learning: dataValues.learning,
        };
        return clientData;
    }
}

module.exports = userLoginService;
