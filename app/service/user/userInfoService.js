'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');

class userInfoService extends Service {
    async userUploadAvatar(avator) {
        const { ctx } = this;
        const oldAvatar = await ctx.model.User.changeAvator(ctx.cookies.get('loginUser', {
            signed: false,
        }), `http://127.0.0.1:8089/avatar/${avator}`);
        await ctx.service.user.userInfoService.deleteAvatar(oldAvatar.substring(oldAvatar.lastIndexOf('/') + 1, oldAvatar.length));
        return;
    }
    async deleteAvatar(avator) {
        if (avator == 'defaultAvatar.jpg') {
            return;
        }
        fs.unlinkSync(`${pc.avator}/${avator}`);
    }
    async userChangeInfo(username, mail) {
        const { ctx } = this;
        await ctx.model.User.changeInfo(username, mail);
        return;
    }
}

module.exports = userInfoService;
