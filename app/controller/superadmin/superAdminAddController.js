'use strict';
const Controller = require('egg').Controller;

class superAdminAddController extends Controller {
    async index() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminAddService.index(ctx.request.body);
        ctx.body = tag;
    }
    async options() {
        const { ctx } = this;
        console.log('...没有打印，不过肯定有路过这里');
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    async checkAdmin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminAddService.checkAdmin(ctx.params.id);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
    async checkAdminUsername() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminAddService.checkAdminUsername(ctx.params.username);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
}

module.exports = superAdminAddController;
