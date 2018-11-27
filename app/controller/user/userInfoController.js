'use strict';
const Controller = require('egg').Controller;
const pc = require('../../config/PathConstant');

class userInfoController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    async userUploadAvatar() {
        const { ctx } = this;
        // 获取 steam
        const stream = await ctx.getFileStream();
        // 上传基础目录
        const uplaodBasePath = pc.avator;
        const filename = await ctx.helper.handleSaveDoc(uplaodBasePath, 'avator', stream);
        await ctx.service.user.userInfoService.userUploadAvatar(filename);
        ctx.body = `http://127.0.0.1:8089/avatar/${filename}`;
    }
    async userChangeInfo() {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        });
        const { username } = ctx.request.body;
        await ctx.service.user.userInfoService.userChangeInfo(username, mail);
        ctx.body = {};
    }
}

module.exports = userInfoController;
