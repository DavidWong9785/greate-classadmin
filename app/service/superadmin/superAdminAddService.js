'use strict';
const Service = require('egg').Service;

class superAdminAddService extends Service {
    async index({ userId, username, password, access }) {
        const { ctx } = this;
        const tag = await ctx.model.Admin.addAdmin(ctx.cookies.get('token', {
            signed: false,
        }), { userId, username, password, access });
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
        const tag = await ctx.model.Admin.checkAdmin(ctx.params.id);
        return tag;
    }
    async checkAdminUsername() {
        const { ctx } = this;
        const tag = await ctx.model.Admin.checkAdminUsername(ctx.params.username);
        return tag;
    }
}

module.exports = superAdminAddService;
