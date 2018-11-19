'use strict';
const Controller = require('egg').Controller;

class superAdminManageController extends Controller {
    // 获取管理员信息表
    async getAdminList() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminManageService.getAdminList(ctx.cookies.get('token', {
            signed: false,
        }), ctx.params.access);
        ctx.body = {
            data: tag,
        };
    }

    // 允许跨域post请求
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 锁定管理员
    async lockAdmin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminManageService.lockAdmin(ctx.params.id);
        ctx.body = {
            data: tag,
        };
    }

    // 解锁管理员
    async unLockAdmin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminManageService.unLockAdmin(ctx.params.id);
        ctx.body = {
            data: tag,
        };
    }

    // 管理员升级
    async upgradeAdmin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminManageService.upgradeAdmin(ctx.params.id);
        ctx.body = {
            data: tag,
        };
    }

    // 管理员降级
    async demoteAdmin() {
        const { ctx } = this;
        const tag = await ctx.service.superadmin.superAdminManageService.demoteAdmin(ctx.params.id);
        ctx.body = {
            data: tag,
        };
    }

    // 修改管理员个人信息
    async changeAdminInfo() {
        const { ctx } = this;
        const p = await ctx.service.superadmin.superAdminManageService.changeAdminInfo(ctx.request.body, ctx.cookies.get('token', {
            signed: false,
        }));
        ctx.body = {
            data: p,
        };
    }

    // 删除管理员
    async deleteAdmin() {
        const { ctx } = this;
        const p = await ctx.service.superadmin.superAdminManageService.deleteAdmin(ctx.params.id, ctx.cookies.get('token', {
            signed: false,
        }));
        ctx.body = {
            data: p,
        };
    }

}

module.exports = superAdminManageController;
