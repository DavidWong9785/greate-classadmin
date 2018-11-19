'use strict';
const Controller = require('egg').Controller;

class teacherRemoveCourseController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 删除章
    async removeChapter() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
        const data = await ctx.service.teacher.teacherRemoveCourseService.removeChapter(ctx.request.body.cindex, doc, courseId);
        ctx.body = {
            data,
        };
    }

    // 删除节
    async removeSection() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
        const data = await ctx.service.teacher.teacherRemoveCourseService.removeSection(ctx.request.body.cindex, ctx.request.body.sindex, doc, courseId);
        ctx.body = {
            data,
        };
    }

    // 删除试题
    async removeQuestion() {
        try {
            const { ctx } = this;
            const qId = ctx.request.body.qId;
            const data = await ctx.service.teacher.teacherRemoveCourseService.removeQuestion(qId);
            ctx.body = {
                data,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    // 从练习移除试题
    async removeQuestionFromPractice() {
        try {
            const { ctx } = this;
            const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
            const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
            const sectionId = ctx.request.body.sectionId;
            const cindex = ctx.request.body.cindex;
            const sindex = ctx.request.body.sindex;
            const qId = ctx.request.body.qId;
            const qindex = ctx.request.body.qindex;
            const data = await ctx.service.teacher.teacherRemoveCourseService.removeQuestionFromPractice(doc, courseId, sectionId, cindex, sindex, qId, qindex);
            ctx.body = {
                data: data,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = teacherRemoveCourseController;
