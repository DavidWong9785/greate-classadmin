'use strict';
const Controller = require('egg').Controller;

class userRegisterController extends Controller {
    async index() {
        const { ctx } = this;
        await ctx.validate({ mail: 'mail' }, ctx.request.body, ctx);
        await ctx.validate({ password: 'pass' }, ctx.request.body, ctx);
        await ctx.validate({ username: 'username' }, ctx.request.body, ctx);
        const tag = await ctx.service.user.userRegisterService.index(ctx.request.body);
        ctx.body = tag;
    }
    async options() {
        const { ctx } = this;
        console.log('...没有打印，不过肯定有路过这里');
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    async checkUser() {
        const { ctx } = this;
        const tag = await ctx.service.user.userRegisterService.checkUser(ctx.params.mail);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
    async checkUsername() {
        const { ctx } = this;
        const tag = await ctx.service.user.userRegisterService.checkUsername(ctx.params.username);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
}

module.exports = userRegisterController;
