'use strict';
const Controller = require('egg').Controller;

class userLearningController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    // 处理添加申报信息
    async userGetCourseList() {
        const { ctx } = this;
        const data = await ctx.service.user.userLearningService.userGetCourseList();
        ctx.body = {
            data
        };
    }
    // 获取课程信息
    async userGetCourseIntroduce() {
        const { ctx } = this;
        const data = await ctx.service.user.userLearningService.userGetCourseIntroduce(ctx.params.id);
        ctx.body = {
            data
        };
    }

    // 检查用户是否已经参加了本课程学习
    async userCheckHaveAttend() {
        const { ctx } = this;
        const data = await ctx.service.user.userLearningService.userCheckHaveAttend(ctx.request.body);
        ctx.body = {
            data
        };
    }

    // 用户获取课程目录
    async userGetCourseCatalog() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const data = await ctx.service.user.userLearningService.userGetCourseCatalog(doc);
        ctx.body = {
            data
        };
    }

    // 用户参与课程学习
    async userAttendStudy() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
        const mail = ctx.request.body.mail;
        const data = await ctx.service.user.userLearningService.userAttendStudy(doc, mail, courseId);
        ctx.body = {
            data
        };
    }

    // 用户获取课程目录(包括学习进度)
    async userGetCourseProgress() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
        const mail = ctx.request.body.mail;
        const data = await ctx.service.user.userLearningService.userGetCourseProgress(doc, mail, courseId);
        ctx.body = {
            data
        };
    }
    // 用户获取学习资源
    async userGetLearningInfo() {
        const { ctx } = this;
        const courseId = ctx.request.body.courseId;
        const cindex = ctx.request.body.cindex;
        const sindex = ctx.request.body.sindex;
        const {courseName} = await ctx.model.Course.getCourseInfo(courseId);
        const doc = ctx.helper.getSaltySha1(courseName, 'courseName');
        const data = await ctx.service.user.userLearningService.userGetLearningInfo(doc, courseId, cindex, sindex, courseName);
        ctx.body = {
            data,
        };
    }

    // 视频观看进度监察
    async userWatchProgress() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const cindex = ctx.request.body.cindex;
        const sindex = ctx.request.body.sindex;
        const duration = ctx.request.body.duration;
        const currentTime = ctx.request.body.currentTime;
        const videoTag = ctx.request.body.videoTag;
        const data = await ctx.service.user.userLearningService.userWatchProgress(doc, cindex, sindex, duration, currentTime, videoTag);
        ctx.body = {
            data,
        };
    }

    // 检查用户练习题的状态（是否观看完视频，是否已完成练习题）
    async userCheckPracticeStatus() {
        const { ctx } = this;
        const { courseId, cindex, sindex } = ctx.request.body;
        const { courseName } = await ctx.model.Course.getCourseInfo(courseId);
        const doc = ctx.helper.getSaltySha1(courseName, 'courseName');
        const data = await ctx.service.user.userLearningService.userCheckPracticeStatus(courseId, cindex, sindex, doc);
        ctx.body = {
            data,
        };
    }

    // 用户提交练习（返回批改后的数据并记录到文件中）
    async userSubmitPractice() {
        const { ctx } = this;
        const { courseId, cindex, sindex, reply } = ctx.request.body;
        const { courseName } = await ctx.model.Course.getCourseInfo(courseId);
        const doc = ctx.helper.getSaltySha1(courseName, 'courseName');
        const data = await ctx.service.user.userLearningService.userSubmitPractice(courseId, cindex, sindex, doc, reply);
        ctx.body = {
            data,
        };
    }

    // 判断是否有下一章或下一节
    async userCheckNextSection() {
        const { ctx } = this;
        const { courseId, cindex, sindex } = ctx.request.body;
        const { courseName } = await ctx.model.Course.getCourseInfo(courseId);
        const doc = ctx.helper.getSaltySha1(courseName, 'courseName');
        const data = await ctx.service.user.userLearningService.userCheckNextSection(courseId, cindex, sindex, doc);
        ctx.body = {
            data,
        };
    }

    // 获取考试信息
    async userGetExamInfo() {
        const { ctx } = this;
        const { courseId, mail } = ctx.request.body;
        const data = await ctx.service.user.userLearningService.userGetExamInfo(courseId, mail);
        ctx.body = {
            data,
        };
    }

    // 用户报名考试
    async userAttendExam() {
        const { ctx } = this;
        const { courseId, mail, examId } = ctx.request.body;
        const attendId = ctx.helper.getSaltySha1(courseId+mail+examId+Date.now()+Math.random()*10000, 'attendId');
        const course = await ctx.model.Course.getCourseInfo(courseId);
        const doc = ctx.helper.getSaltySha1(course.courseName, 'courseName');
        const data = await ctx.service.user.userLearningService.userAttendExam(courseId, mail, examId, attendId, doc);
        ctx.body = {
            data,
        };
    }

    // 进入考试路由，判断是否已经报名了考试
    async userCheckHaveAttendExam() {
        const { ctx } = this;
        const { cid, mail } = ctx.request.body;
        const data = await ctx.service.user.userLearningService.userCheckHaveAttendExam(cid, mail);
        ctx.body = {
            data,
        };
    }

    // 用户获取考卷
    async userGetExamPaper() {
        try {
            const { ctx } = this;
            const { cid, mail } = ctx.request.body;
            const data = await ctx.service.user.userLearningService.userGetExamPaper(cid, mail);
            ctx.body = {
                data,
            };
        } catch (error) {
            
        }
    }

    // 用户离开了考试
    async userLeaveExam() {
        const { ctx } = this;
        const { cid, mail } = ctx.request.body;
        const data = await ctx.service.user.userLearningService.userLeaveExam(cid, mail);
        ctx.body = {
            data,
        };
    }

    // 用户提交考卷
    async userSubmitExamPaper() {
        const { ctx } = this;
        const { id, mail, examId, single , multiple, judge, gap, short } = ctx.request.body;
        const data = await ctx.service.user.userLearningService.userSubmitExamPaper(id, mail, examId, single , multiple, judge, gap, short);
        ctx.body = {
            data,
        };
    }

    // 用户获取我的课程信息
    async userGetMyCourseInfo() {
        const { ctx } = this;
        const mail = ctx.cookies.get('loginUser', {
            signed: false,
        });
        const data = await ctx.service.user.userLearningService.userGetMyCourseInfo(mail);
        ctx.body = {
            data,
        };
    }

}

module.exports = userLearningController;
