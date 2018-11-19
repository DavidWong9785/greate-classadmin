'use strict';
const Controller = require('egg').Controller;
const pc = require('../../config/PathConstant');

class teacherHandleExamController extends Controller {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }
    // 创建试卷
    async createExamPaper() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const { paperName } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.createExamPaper(courseId, paperName);
        ctx.body = {
            data,
        }
    }
    // 检查考卷名字是否已经存在
    async checkPaperName() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const { paperName } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.checkPaperName(courseId, paperName);
        ctx.body = {
            data,
        }
    }
    // 获取考卷列表
    async teacherGetPaperList() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetPaperList(courseId);
        ctx.body = {
            data,
        }
    }
    // 获取考卷详情
    async teacherGetPaperDetail() {
        const {ctx} = this;
        const paperId = ctx.request.body.paperId;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetPaperDetail(paperId);
        ctx.body = {
            data,
        }
    }
    // 根据过滤规则查找试题列表
    async teacherGetQuestionListByFilter() {
        const {ctx} = this;
        const { ignore, type, difficulty, pageIndex, pageSize } = ctx.request.body;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetQuestionListByFilter(ignore, type, courseId, difficulty, pageIndex, pageSize);
        ctx.body = {
            data,
        }
    }

    // 老师添加试题到考卷
    async teacherAddQuestionToPaper() {
        const {ctx} = this;
        const { qId, type, paperId } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherAddQuestionToPaper(qId, type, paperId);
        ctx.body = {
            data,
        }
    }

    // 老师修改考卷里的题目
    async teacherUpdateQuestionToPaper() {
        const {ctx} = this;
        const { qId, paperId, type, index } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherUpdateQuestionToPaper(qId, type, paperId, index);
        ctx.body = {
            data,
        }
    }

    // 老师删除考卷
    async teacherDeletePaper() {
        const {ctx} = this;
        const { paperId } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherDeletePaper(paperId);
        ctx.body = {
            data
        }
    }

    // 老师添加考试
    async teacherAddExam() {
        const {ctx} = this;
        const { eTitle, eTime, paperId, start, end } = ctx.request.body;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const examId = ctx.helper.getSaltyMd5(eTitle+eTime+courseId+paperId+Date.now()+Math.random()*10000, 'examId');
        const data = await ctx.service.teacher.teacherHandleExamService.teacherAddExam(examId, courseId, eTitle, eTime, paperId, start, end);
        ctx.body = {
            data
        }
    }
    
    // 老师根据条件获取考试列表
    async teacherGetExamList() {
        const {ctx} = this;
        const { findTag } = ctx.request.body;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetExamList(courseId, findTag);
        ctx.body = {
            data
        }
    }
    
    // 老师获待批改考卷列表
    async teacherGetExamCorrectList() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetExamCorrectList(courseId);
        ctx.body = {
            data
        }
    }
    
    // 老师获取待修改的考卷详情
    async teacherGetExamCorrectDetail() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const { examId, mail } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetExamCorrectDetail(courseId, examId, mail);
        ctx.body = {
            data
        }
    }
    
    // 老师改完卷
    async teacherFinishCorrect() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const { examId, mail, gapScore, shortScore } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherFinishCorrect(courseId, examId, mail, gapScore, shortScore);
        ctx.body = {
            data
        }
    }

    // 老师获取学生信息
    async teacherGetStudentInfo() {
        const {ctx} = this;
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const { pageIndex, filter, pageSize } = ctx.request.body;
        const data = await ctx.service.teacher.teacherHandleExamService.teacherGetStudentInfo(courseId, pageIndex, pageSize, filter);
        ctx.body = {
            data
        }
    }

}

module.exports = teacherHandleExamController;
