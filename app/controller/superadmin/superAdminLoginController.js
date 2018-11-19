'use strict';
const Controller = require('egg').Controller;
const pehelper = require('../../extend/crypto/PasswordEncrypt');

class superAdminLoginController extends Controller {
    async index() {
        const { ctx } = this;
        // console.log(ctx.request.headers);
        // 客户端必须传EGG_SESS，服务器才能取到相应的session值，所以每次请求可以根据用户名获取session
        // 如果是undefined，那就是非法请求，直接返回，弄个中间件
        const tag = await ctx.service.superadmin.superAdminLoginService.index(ctx.request.body.userId, pehelper.encryptBySalt(ctx.request.body.password));
        ctx.body = {
            data: tag,
        };
    }

    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 已经登录，获取基本数据
    async adminhavebeenlogin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminLoginService.adminhavebeenlogin(ctx.cookies.get('token', {
            signed: false,
        }));
        ctx.body = {
            data: tag,
        };
    }

    // 锁定管理员
    async lockAdmin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminLoginService.lockAdmin(ctx.params.id);
        ctx.body = {
            data: tag,
        };
    }
}

module.exports = superAdminLoginController;
