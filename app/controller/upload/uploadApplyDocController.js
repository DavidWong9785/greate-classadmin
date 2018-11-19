'use strict';
const Controller = require('egg').Controller;
const pc = require('../../config/PathConstant');

class uploadApplyDocController extends Controller {
    async uploadApplyDoc() {
        const { ctx } = this;
        // 获取 steam
        try {
            const stream = await ctx.getFileStream();
            // 上传基础目录
            const uplaodBasePath = pc.applydoc;
            const filename = await ctx.helper.handleSaveDoc(uplaodBasePath, 'applydoc', stream);
            await ctx.service.upload.uploadApplyDocService.uploadApplyDoc(filename);
            ctx.body = `http://127.0.0.1:8090/applydoc/${filename}`;
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = uploadApplyDocController;
