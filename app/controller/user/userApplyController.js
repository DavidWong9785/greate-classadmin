'use strict';
const Controller = require('egg').Controller;

class userApplyController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    // 处理添加申报信息
    async handleApply() {
        const { ctx, app } = this;
        await ctx.validate({ teacherName: 'teacherName' }, ctx.request.body, ctx);
        await ctx.validate({ courseName: 'courseName' }, ctx.request.body, ctx);
        await ctx.validate({ courseDesc: 'courseDesc' }, ctx.request.body, ctx);
        const { teacherName, courseName, courseDesc } = ctx.request.body;
        const tag = await ctx.service.user.userApplyService.handleApply(ctx.cookies.get('loginUser', {
            signed: false,
        }), { teacherName, courseName, courseDesc });
        ctx.body = tag;
    }
    // 获取申报信息
    async getApplyInfo() {
        const { ctx } = this;
        const tag = await ctx.service.user.userApplyService.getApplyInfo(ctx.cookies.get('loginUser', {
            signed: false,
        }));
        ctx.body = {
            data: tag,
        };
    }
    // 检查老师名字是否被占用
    async checkTeacherName() {
        const { ctx } = this;
        const tag = await ctx.service.user.userApplyService.checkTeacherName(ctx.request.body.teacherName, ctx.cookies.get('loginUser', {
            signed: false,
        }));
        ctx.body = tag;
    }
    // 检查课程名字是否被占用
    async checkCourseName() {
        const { ctx } = this;
        const tag = await ctx.service.user.userApplyService.checkCourseName(ctx.request.body.courseName, ctx.cookies.get('loginUser', {
            signed: false,
        }));
        ctx.body = tag;
    }
}

module.exports = userApplyController;
