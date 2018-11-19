'use strict';
const Controller = require('egg').Controller;

class superAdminHandleVideoApplyController extends Controller {
    async getVideoApplyList() {
        const { ctx } = this;
        const data = await ctx.service.superadmin.superAdminHandleVideoApplyService.getVideoApplyList();
        ctx.body = {
            data,
        };
    }
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    async acceptApply() {
        const { ctx } = this;
        const cindex = ctx.request.body.cindex;
        const sindex = ctx.request.body.sindex;
        const doc = ctx.request.body.doc;
        const courseId = ctx.request.body.courseId;
        const sectionId = ctx.request.body.sectionId;
        const obj = {
            courseId,
            cindex,
            sindex,
            doc,
            sectionId
        };
        const data = await ctx.service.superadmin.superAdminHandleVideoApplyService.acceptApply(obj);
        ctx.body = {
            data
        };
    }
    async backApply() {
        const { ctx } = this;
        const cindex = ctx.request.body.cindex;
        const sindex = ctx.request.body.sindex;
        const doc = ctx.request.body.doc;
        const courseId = ctx.request.body.courseId;
        const sectionId = ctx.request.body.sectionId;
        const obj = {
            courseId,
            cindex,
            sindex,
            doc,
            sectionId
        };
        const data = await ctx.service.superadmin.superAdminHandleVideoApplyService.backApply(obj);
        ctx.body = {
            data
        };
    }
}

module.exports = superAdminHandleVideoApplyController;
