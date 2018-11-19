'use strict';
const Controller = require('egg').Controller;

class teacherChangeCourseController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 修改课程描述
    async changeCourseDesc() {
        const { ctx } = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const data = await ctx.service.teacher.teacherChangeCourseService.changeCourseDesc(ctx.request.body.courseDesc, courseId);
        ctx.body = {
            data,
        };
    }

    // 修改讲师介绍
    async changeTeacherDesc() {
        const { ctx } = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const data = await ctx.service.teacher.teacherChangeCourseService.changeTeacherDesc(ctx.request.body.teacherDesc, courseId);
        ctx.body = {
            data,
        };
    }

    // 修改试题
    async changeQuestion() {
        const { ctx } = this;
        const data = await ctx.service.teacher.teacherChangeCourseService.changeQuestion(ctx.request.body.question);
        ctx.body = {
            data,
        };
    }

    // 修改章名字
    async changeChapterName() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const chapterName = ctx.request.body.chapterName;
        const cindex = ctx.request.body.cindex;
        const data = await ctx.service.teacher.teacherChangeCourseService.changeChapterName(doc, chapterName, cindex);
        ctx.body = {
            data
        };
    }

    // 修改节名字
    async changeSectionName() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const sectionName = ctx.request.body.sectionName;
        const cindex = ctx.request.body.cindex;
        const sindex = ctx.request.body.sindex;
        console.log('111111111111111111111111111111');
        const data = await ctx.service.teacher.teacherChangeCourseService.changeSectionName(doc, sectionName, cindex, sindex);
        ctx.body = {
            data
        };
    }
}

module.exports = teacherChangeCourseController;
