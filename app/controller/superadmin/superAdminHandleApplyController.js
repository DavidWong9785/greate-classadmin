'use strict';
const Controller = require('egg').Controller;

class superAdminHandleApplyController extends Controller {
    async getApplyList() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminHandleApplyService.getApplyList(ctx.params.status);
        ctx.body = {
            data: tag,
        };
    }
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    async acceptApply() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminHandleApplyService.acceptApply(ctx.params.id);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
    async backApply() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminHandleApplyService.backApply(ctx.params.id, ctx.request.body.handleMsg);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
    async removeApply() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminHandleApplyService.removeApply(ctx.params.id);
        if (tag != null) {
            ctx.body = '1';
        } else {
            ctx.body = '0';
        }
    }
}

module.exports = superAdminHandleApplyController;
