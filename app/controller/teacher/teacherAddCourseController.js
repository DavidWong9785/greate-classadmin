'use strict';
const Controller = require('egg').Controller;
const pc = require('../../config/PathConstant');
const fs = require('fs');

class teacherAddCourseController extends Controller {

    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 添加章
    async addChapter() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
        const data = await ctx.service.teacher.teacherAddCourseService.addChapter(ctx.request.body.chapter, doc, courseId);
        ctx.body = {
            data,
        };
    }

    // 添加节
    async addSection() {
        const { ctx } = this;
        const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
        const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
        const data = await ctx.service.teacher.teacherAddCourseService.addSection(ctx.request.body.name, doc, ctx.request.body.cindex, courseId);
        ctx.body = {
            data,
        };
    }

    // 添加视频
    async addVideo() {
        const { ctx } = this;
        try {
            const stream = await ctx.getFileStream();
            const courseName = decodeURIComponent(ctx.request.headers['course-name']);
            const sectionId = ctx.request.headers['section-id'];
            const fragmentIndex = ctx.request.headers['fragment-index'];
            const courseId = ctx.helper.getSaltyMd5(courseName, 'courseName');
            const uplaodBasePath = `${pc.video}/${courseId}/${sectionId}`;
            const filename = await ctx.helper.handleSaveFragDoc(uplaodBasePath, fragmentIndex, stream);
            ctx.body = {
                data: filename,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    // 合并视频
    async mergeVideo() {
        try {
            const { ctx } = this;
            const courseName = ctx.request.body.courseName;
            const chapterName = ctx.request.body.chapterName;
            const sectionName = ctx.request.body.sectionName;
            const doc = ctx.helper.getSaltySha1(courseName, 'courseName');
            const courseId = ctx.helper.getSaltyMd5(courseName, 'courseName');
            const sectionId = ctx.request.body.id;
            const fragmentList = ctx.request.body.fragmentList;
            const uplaodBasePath = `${pc.video}/${courseId}/${sectionId}/prepare.avi`;
            const dirName = `${pc.video}/${courseId}/${sectionId}`;
            const tag = await ctx.helper.mergeFrag(dirName, uplaodBasePath, fragmentList);

            const data = {
                courseId,
                sectionId,
                dirName: `${pc.proxyVideo}/${courseId}/${sectionId}/prepare.avi`,
                doc,
                courseName,
                sectionName,
                chapterName,
                cindex: ctx.request.body.cindex,
                sindex: ctx.request.body.sindex,
            };
            const addVideoApply = await ctx.service.teacher.teacherAddCourseService.addVideoApply(data);
            ctx.body = {
                data: tag,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    // 课件上传
    async addPPT() {
        const { ctx } = this;
        try {
            const stream = await ctx.getFileStream();
            const courseName = decodeURIComponent(ctx.request.headers['course-name']);
            const sectionId = ctx.request.headers['section-id'];
            const courseId = ctx.helper.getSaltyMd5(courseName, 'courseName');
            const doc = ctx.helper.getSaltySha1(courseName, 'courseName');
            const uplaodBasePath = `${pc.ppt}/${courseId}/${sectionId}`;
            const filename = await ctx.helper.handleSaveDoc(uplaodBasePath, ':ppt', stream);
            await ctx.service.teacher.teacherAddCourseService.addPPT(doc, courseId, sectionId, filename);
            ctx.body = {
                data: filename,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    // 添加试题
    async addQuestion() {
        const { ctx } = this;
        try {
            const courseId = ctx.cookies.get('courseId', {
                signed: false,
            });
            const question = ctx.request.body.question;
            // qid = courseId + title + answer + 10000以内随机值
            const qid = ctx.helper.getSaltyMd5(courseId + question.title + question.answer + Date.now() + Math.random() * 10000, 'question');
            await ctx.service.teacher.teacherAddCourseService.addQuestion(courseId, qid, question);
            ctx.body = {
                data: '',
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    // 添加试题到练习
    async addQuestionToPractice() {
        try {
            const { ctx } = this;
            const doc = ctx.helper.getSaltySha1(ctx.request.body.courseName, 'courseName');
            const courseId = ctx.helper.getSaltyMd5(ctx.request.body.courseName, 'courseName');
            const sectionId = ctx.request.body.sectionId;
            const cindex = ctx.request.body.cindex;
            const sindex = ctx.request.body.sindex;
            const title = ctx.request.body.title;
            const qId = ctx.request.body.qId;
            const data = await ctx.service.teacher.teacherAddCourseService.addQuestionToPractice(doc, courseId, sectionId, cindex, sindex, title, qId);
            ctx.body = {
                data: data,
            };
        } catch (error) {
            throw new Error(error);
        }
    }

    // 海报上传
    async addPoster() {
        const { ctx } = this;
        try {
            const stream = await ctx.getFileStream();
            const courseId = decodeURIComponent(ctx.request.headers['course-id']);
            const uplaodBasePath = `${pc.poster}/${courseId}`;
            if (!fs.existsSync(uplaodBasePath)) {
                fs.mkdirSync(uplaodBasePath);
            }
            const filename = await ctx.helper.handleSaveDoc(uplaodBasePath, ':poster', stream);
            const poster = `http://localhost:8089/poster/${courseId}/${filename}`;
            await ctx.service.teacher.teacherAddCourseService.addPoster(courseId, poster);
            ctx.body = {
                poster: poster,
            };
        } catch (error) {
            throw new Error(error);
        }
    }
    
}

module.exports = teacherAddCourseController;
