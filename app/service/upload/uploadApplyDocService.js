'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');

class uploadApplyDocService extends Service {
    async uploadApplyDoc(applydoc) {
        const { ctx } = this;
        const oldDoc = await ctx.model.Apply.updateDocPath(ctx.cookies.get('loginUser', {
            signed: false,
        }), `http://127.0.0.1:8090/applydoc/${applydoc}`);
        if (oldDoc === null) return;
        await ctx.service.upload.uploadApplyDocService.deleteApplyDoc(oldDoc.substring(oldDoc.lastIndexOf('/') + 1, oldDoc.length));
        return;
    }
    async deleteApplyDoc(applydoc) {
        fs.unlinkSync(`${pc.applydoc}/${applydoc}`);
    }
}

module.exports = uploadApplyDocService;
