'use strict';
const Service = require('egg').Service;
const pc = require('../../config/PathConstant');
const fs = require('fs');

class teacherHandleExamService extends Service {
    // 创建试卷
    async createExamPaper(courseId, paperName) {
        const { ctx } = this;
        const paperId = ctx.helper.getSaltyMd5(courseId+paperName+Date.now()+Math.random()*10000, 'paperId');
        await ctx.model.Paper.createPaper(paperId, courseId, paperName);
        return paperId;
    }
    // 检查考卷名字是否已经存在
    async checkPaperName(courseId, paperName) {
        const {ctx} = this;
        const data = await ctx.model.Paper.checkPaperName(courseId, paperName);
        if (data != undefined || data != null) {
            // 名字已存在
            return '0';
        };
        return '1';
    }
    // 获取考卷列表
    async teacherGetPaperList(courseId) {
        const {ctx} = this;
        const data = await ctx.model.Paper.getPaperList(courseId);
        return data;
    }
    // 获取考卷详情
    async teacherGetPaperDetail(paperId) {
        const {ctx} = this;
        const { paperName, courseId, single, multiple, judge, gap, short } = await ctx.model.Paper.getPaperDetail(paperId);
        const returnData = {
            paperId,
            paperName,
            courseId,
            single: [],
            multiple: [],
            judge: [],
            gap: [],
            short: [],
        }
        let title;
        if (single.length > 0) {
            for (let i = 0; i < single.length; i++) {
                title = await ctx.model.Question.getQuestionTitleByQid(single[i]);
                returnData.single.push({
                    qId: single[i],
                    title,
                });
            }
        }
        if (multiple.length > 0) {
            for (let i = 0; i < multiple.length; i++) {
                title = await ctx.model.Question.getQuestionTitleByQid(multiple[i]);
                returnData.multiple.push({
                    qId: multiple[i],
                    title,
                });
            }
        }
        if (judge.length > 0) {
            for (let i = 0; i < judge.length; i++) {
                title = await ctx.model.Question.getQuestionTitleByQid(judge[i]);
                returnData.judge.push({
                    qId: judge[i],
                    title,
                });
            }
        }
        if (gap.length > 0) {
            for (let i = 0; i < gap.length; i++) {
                title = await ctx.model.Question.getQuestionTitleByQid(gap[i]);
                returnData.gap.push({
                    qId: gap[i],
                    title,
                });
            }
        }
        if (short.length > 0) {
            for (let i = 0; i < short.length; i++) {
                title = await ctx.model.Question.getQuestionTitleByQid(short[i]);
                returnData.short.push({
                    qId: short[i],
                    title,
                });
            }
        }
        return returnData;
    }
    // 根据过滤规则查找试题列表
    async teacherGetQuestionListByFilter(ignore, type, courseId, difficulty, pageIndex, pageSize) {
        const {ctx} = this;
        const data = await ctx.model.Question.getQuestiionByPageAndFilterQid(courseId, type, difficulty, pageIndex, pageSize, ignore);
        return data;
    }
    
    // 老师添加试题到考卷 / 修改试题
    async teacherAddQuestionToPaper(qId, type, paperId) {
        const {ctx} = this;
        const data = await ctx.model.Paper.getPaperDetail(paperId);
        data[type].push(qId);
        const statusTag = data['single'].length == 15 && data['multiple'].length == 5 && data['judge'].length == 6 && data['gap'].length == 4 && data['short'].length == 2;
        if (statusTag) {
            await ctx.model.Paper.changeStatus(paperId);
        }
        await ctx.model.Paper.addQuestionToPaper({type, data: JSON.stringify(data[type])}, paperId);
        await ctx.service.teacher.teacherHandleExamService.teacherAddEusing(qId, paperId);
        return;
    }

    // 老师修改考卷里的题目
    async teacherUpdateQuestionToPaper(qId, type, paperId, index) {
        const {ctx} = this;
        const data = await ctx.model.Paper.getPaperDetail(paperId);
        data[type][index] = qId;
        await ctx.model.Paper.addQuestionToPaper({type, data: JSON.stringify(data[type])}, paperId);
        await ctx.service.teacher.teacherHandleExamService.teacherAddEusing(qId, paperId);
        return;
    }

    async teacherAddEusing(qId, paperId) {
        const {ctx} = this;
        const checkUsingExist = await ctx.model.Eusing.checkUsingExist(qId, paperId);
        if (checkUsingExist == undefined || checkUsingExist == null) {
            const courseId = ctx.cookies.get('courseId', {
                signed: false,
            });
            const usingId = ctx.helper.getSaltyMd5(qId+paperId+Date.now()+Math.random()*10000, 'usingId');
            await ctx.model.Eusing.addUsing(usingId, courseId, paperId, qId);
        }
    }

    // 老师删除考卷
    async teacherDeletePaper(paperId) {
        const {ctx} = this;
        const checkStatus = await ctx.model.Paper.checkStatus(paperId);
        if (checkStatus != undefined || checkStatus != null) {
            if (checkStatus.status != '1') {
                await ctx.model.Eusing.removeUsingByPaper(paperId);
                await ctx.model.Paper.removePaper(paperId);
            }
        }
        return;
    }

    // 老师添加考试
    async teacherAddExam(examId, courseId, eTitle, eTime, paperId, start, end) {
        const {ctx} = this;
        const data = await ctx.model.Exam.createExam(examId, courseId, eTitle, eTime, paperId, start, end);
        return data;
    }

    // 老师根据条件获取考试列表
    async teacherGetExamList(courseId, findTag) {
        const {ctx} = this;
        const data = await ctx.model.Exam.getExamList(courseId, findTag);
        return data;
    }
       
    // 老师获待批改考卷列表
    async teacherGetExamCorrectList(courseId) {
        const {ctx} = this;
        const data = [];
        const corrent = await ctx.model.Attend.getExamCorrectList(courseId);
        for (let i in corrent) {
            data[i] = {};
            data[i].mail = corrent[i].dataValues.mail;
            data[i].username = await ctx.model.User.getUsernameByMail(data[i].mail);
            data[i].examId = corrent[i].dataValues.examId;
            const { eTitle } = await ctx.model.Exam.getETitleById(corrent[i].dataValues.examId);
            data[i].eTitle = eTitle;
        }
        return data;
    }
        
    // 老师获取待修改的考卷详情
    async teacherGetExamCorrectDetail(courseId, examId, mail) {
        const {ctx} = this;
        const checkCorrect = await ctx.model.Attend.checkCorrect(courseId, mail);
        if (!checkCorrect) {
            return 'invalid operation';
        }
        const { single, multiple, judge } = await ctx.model.Attend.getSMJScorce(courseId, mail, examId);
        const { gap, short } = await ctx.model.Final.getGSAnswer(courseId, mail, examId);
        const { paperId } = await ctx.model.Exam.getExamPaperId(courseId, examId);
        const questionList = await ctx.model.Paper.getGSAnswer(paperId);
        const answer = { gap: [], short: [] };
        for (let i in questionList.gap) {
            const res = await ctx.model.Question.getAnswerByQid(questionList.gap[i])
            answer.gap.push(res);
        }
        for (let i in questionList.short) {
            const res = await ctx.model.Question.getAnswerByQid(questionList.short[i])
            answer.short.push(res);
        }
        const data = { single, multiple, judge, gap, short, answer };
        return data;
    }
        
    // 老师改完卷
    async teacherFinishCorrect(courseId, examId, mail, gapScore, shortScore) {
        const {ctx} = this;
        // 把成绩记录在attend，并修改状态
        const { single, multiple, judge, gap, short } = await ctx.model.Attend.finishCorrect(courseId, examId, mail, gapScore, shortScore);
        // 统计总成绩
        const examScore = +single + +multiple + +judge + +gap + +short;
        await ctx.model.Learning.addFinalScore(courseId, mail, examScore);
        return;
    }
        
    // 老师获取学生信息
    async teacherGetStudentInfo(courseId, pageIndex, pageSize, filter) {
        const {ctx} = this;
        const data = await ctx.model.Learning.getInfoListByCourseId(courseId, pageIndex, pageSize, filter);
        for (var i in data) {
            data[i].dataValues.username = await ctx.model.User.getUsernameByMail(data[i].mail);
        }
        return data;
    }
}

module.exports = teacherHandleExamService;
