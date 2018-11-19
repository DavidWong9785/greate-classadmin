'use strict';
const Controller = require('egg').Controller;
const pehelper = require('../../extend/crypto/PasswordEncrypt');

class userLoginController extends Controller {
    async index() {
        const { ctx } = this;
        // 客户端必须传EGG_SESS，服务器才能取到相应的session值，所以每次请求可以根据用户名获取session
        // 如果是undefined，那就是非法请求，直接返回，弄个中间件
        await ctx.validate({ mail: 'mail' }, ctx.request.body, ctx);
        await ctx.validate({ password: 'pass' }, ctx.request.body, ctx);
        const tag = await ctx.service.user.userLoginService.index(ctx.request.body.mail, pehelper.encryptBySalt(ctx.request.body.password), ctx.request.body.unLoginTag);
        ctx.body = tag;
    }
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    async haveBeenLogin() {
        const { ctx } = this;
        const tag = await ctx.service.user.userLoginService.haveBeenLogin(ctx.cookies.get('loginUser', {
            signed: false,
        }));
        ctx.body = tag;
    }
}

module.exports = userLoginController;
