'use strict';
const Controller = require('egg').Controller;

class registerCodeController extends Controller {
    async index() {
        const { ctx } = this;
        console.log(ctx.request.query);
        const mailTag = ctx.validate({ mail: 'mail' }, ctx.request.query);
        if (mailTag === '0') {
            ctx.body = '0';
            return;
        }
        await ctx.service.authcode.registerCodeService.index(ctx.request.query.mail);
        ctx.body = '验证码已发送';
    }
}

module.exports = registerCodeController;
