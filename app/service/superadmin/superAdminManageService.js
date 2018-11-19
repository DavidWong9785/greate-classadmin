'use strict';
const Service = require('egg').Service;

class superAdminManageService extends Service {
    // 获取管理员列表
    async getAdminList(userId, access) {
        const { ctx } = this;
        const admin = new Set(await ctx.model.Admin.getAdminList(access));
        if (access === '1') {
            for (const iadmin of admin.values()) {
                for (const index in iadmin) {
                    if (iadmin[index].userId === userId) {
                        iadmin.splice(index, 1);
                    }
                }
            }
        }
        return Array.from(admin);
    }
    // 锁定管理员
    async lockAdmin(userId) {
        const { ctx, app } = this;
        const p = await ctx.model.Admin.lockAdmin(userId, ctx.cookies.get('token', {
            signed: false,
        }));
        if (p !== '0') {
            await app.redis.get('loginkey').del(userId);
        }
        return p;
    }
    // 解锁管理员
    async unLockAdmin(userId) {
        const { ctx, app } = this;
        const p = await ctx.model.Admin.unLockAdmin(userId, ctx.cookies.get('token', {
            signed: false,
        }));
        if (p !== '0') {
            const result = ctx.helper.encryptLoginCookies(userId);
            await app.redis.get('loginkey').set(userId, result);
        }
        return p;
    }
    // 升级管理员
    async upgradeAdmin(userId) {
        const { ctx } = this;
        const p = await ctx.model.Admin.upgradeAdmin(userId, ctx.cookies.get('token', {
            signed: false,
        }));
        return p;
    }
    // 降级管理员
    async demoteAdmin(userId) {
        const { ctx } = this;
        const p = await ctx.model.Admin.demoteAdmin(userId, ctx.cookies.get('token', {
            signed: false,
        }));
        return p;
    }
    // 修改管理员个人信息
    async changeAdminInfo(username, token) {
        const { ctx } = this;
        const p = await ctx.model.Admin.changeAdminInfo(username, token);
        return p;
    }

    // 删除管理员
    async deleteAdmin(userId, token) {
        const { ctx } = this;
        const p = await ctx.model.Admin.deleteAdmin(userId, token);
        return p;
    }

}

module.exports = superAdminManageService;
