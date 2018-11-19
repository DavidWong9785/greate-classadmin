'use strict';
const Controller = require('egg').Controller;

class teacherGetCourseController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 获取课程信息
    async getCourseInfo() {
        const { ctx } = this;
        const data = await ctx.service.teacher.teacherGetCourseService.getCourseInfo(ctx.cookies.get('loginUser', {
            signed: false,
        }));
        ctx.body = {
            data,
        };
    }

    // 判断章名字是否已经存在
    async checkCSName() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const tag = await ctx.service.teacher.teacherGetCourseService.checkCSName(ctx.request.body.name, doc);
        ctx.body = {
            data: tag,
        };
    }

    // 获取课程列表
    async getCourseList() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const data = await ctx.service.teacher.teacherGetCourseService.getCourseList(doc);
        ctx.body = {
            data,
        };
    }

    // 获取试题列表
    async getQuestionList() {
        const { ctx } = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const type = ctx.request.body.type;
        const difficulty = ctx.request.body.difficulty;
        const pageIndex = ctx.request.body.pageIndex;
        const pageSize = ctx.request.body.pageSize;
        const data = await ctx.service.teacher.teacherGetCourseService.getQuestionList(courseId, type, difficulty, pageIndex, pageSize);
        ctx.body = {
            data,
        };
    }

    // 获取试题列表(过滤相应qId)
    async getQuestionListFilterQid() {
        const { ctx } = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const type = ctx.request.body.type;
        const difficulty = ctx.request.body.difficulty;
        const pageIndex = ctx.request.body.pageIndex;
        const pageSize = ctx.request.body.pageSize;
        const ignore = ctx.request.body.ignore;
        const data = await ctx.service.teacher.teacherGetCourseService.getQuestionListFilterQid(courseId, type, difficulty, pageIndex, pageSize, ignore);
        ctx.body = {
            data,
        };
    }

    // 获取课程内容detail
    async teacherGetCourseDetailBysectionId() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const cindex = ctx.request.body.cindex;
        const sindex = ctx.request.body.sindex;
        const data = await ctx.service.teacher.teacherGetCourseService.teacherGetCourseDetailBysectionId(doc, cindex, sindex);
        ctx.body = {
            data,
        }
    }
}

module.exports = teacherGetCourseController;
