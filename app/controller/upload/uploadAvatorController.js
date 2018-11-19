'use strict';
const Controller = require('egg').Controller;
const pc = require('../../config/PathConstant');

class uploadAvatorController extends Controller {
    async uploadAvator() {
        const { ctx } = this;
        // 获取 steam
        const stream = await ctx.getFileStream();
        // 上传基础目录
        const uplaodBasePath = pc.avator;
        const filename = await ctx.helper.handleSaveDoc(uplaodBasePath, 'avator', stream);
        await ctx.service.upload.uploadAvatorService.uploadAvator(filename);
        ctx.body = `http://127.0.0.1:8089/avatar/${filename}`;
    }
}

module.exports = uploadAvatorController;
