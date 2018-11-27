'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');

class uploadAvatorService extends Service {
    async uploadAvator(avator) {
        const { ctx } = this;
        const oldAvatar = await ctx.model.Admin.changeAvator(ctx.cookies.get('token', {
            signed: false,
        }), `http://127.0.0.1:8089/avatar/${avator}`);
        await ctx.service.upload.uploadAvatorService.deleteAvator(oldAvatar.substring(oldAvatar.lastIndexOf('/') + 1, oldAvatar.length));
        return;
    }
    async deleteAvator(avator) {
        if (avator == 'defaultAvatar.jpg') {
            return;
        }
        fs.unlinkSync(`${pc.avator}/${avator}`);
    }
}

module.exports = uploadAvatorService;
