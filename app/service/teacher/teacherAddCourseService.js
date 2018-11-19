'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');

class teacherAddCourseService extends Service {

    async addChapter(chapter, doc, courseId) {
        const { ctx } = this;
        let data = null;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        // 如果有未完整的章节，就不允许再添加
        if (data.length !== 0) {
            data.forEach((citem, cindex) => {
                if (citem.section.length !== 0) {
                    citem.section.forEach((sitem, sindex) => {
                        if (sitem.status === '0') {
                            return;
                        }
                    });
                }
            });
        }
        chapter.courseId = courseId;
        data.push(chapter);
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return data;
    }

    async addSection(sectionName, doc, cindex, courseId) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        // 如果有未完整的章节，就不允许再添加
        if (data.length !== 0 && data[cindex].section.length !== 0) {
            data[cindex].section.forEach((sitem, sindex) => {
                if (sitem.status === '0') {
                    return;
                }
            });
        }
        const sectionId = await ctx.helper.getSaltyMd5(courseId + sectionName, 'section');
        await ctx.helper.makeDir(`${pc.video}/${courseId}/${sectionId}`);
        await ctx.helper.makeDir(`${pc.ppt}/${courseId}/${sectionId}`);
        // console.log(sectionName);
        data[cindex].section.push({
            // 节名字
            sectionName,
            // 节id
            sectionId,
            // 是否已上传视频
            video: '0',
            // 是否已上传PPT
            ppt: false,
            // 练习题
            practice: [],
            // 当视频、ppt、练习全部就位，状态就变为1，学生便可以访问
            status: 0,
        });
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return data;
    }

    async addVideoApply({ courseId, sectionId, dirName, doc, cindex, sindex, chapterName, sectionName }) {
        try {
            const { ctx } = this;
            const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
            data[cindex].section[sindex].video = '1';
            await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
            await ctx.model.Video.addVideoApply(doc, courseId, sectionId, dirName, chapterName, sectionName, cindex, sindex);
            return;
        } catch (error) {
            throw new Error(error);
        }
    }

    async addPPT(doc, courseId, sectionId, filename) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        let removeFile;
        let c = null
        let s = null;
        data.forEach((citem, cindex) => {
            if (citem.courseId === courseId) {
                citem.section.forEach((sitem, sindex) => {
                    if (sitem.sectionId === sectionId) {
                        if (sitem.ppt !== false) {
                            removeFile = sitem.ppt;
                        }
                        sitem.ppt = filename;
                        if (sitem.status !== 1) {
                            c = cindex;
                            s = sindex;
                        }
                    }
                })
            }
        });
        
        if (removeFile !== undefined) {
            await ctx.helper.forceRemove(`${pc.ppt}/${courseId}/${sectionId}/${removeFile}`);
        }

        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        if (data[c].section[s].status !== 1) {
            await ctx.service.teacher.sectiontatusService.checkSection(doc, c, s);
        }
        return;
    }

    // 添加试题
    async addQuestion(courseId, qid, question) {
        const { ctx } = this;
        await ctx.model.Question.addQuestion(courseId, qid, question);
        return;
    }

    // 添加试题到练习
    async addQuestionToPractice(doc, courseId, sectionId, cindex, sindex, title, qId) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        if (data[cindex].section[sindex].practice.length === 5) {
            return;
        }
        data[cindex].section[sindex].practice.push({
            // 题目名字
            title,
            // 题目id
            qId,
        });
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        if (data[cindex].section[sindex].status !== 1) {
            await ctx.service.teacher.sectiontatusService.checkSection(doc, cindex, sindex);
        }
        const checkUsingExist = await ctx.model.Pusing.checkUsingExist(qId, sectionId, courseId);
        if (checkUsingExist == undefined || checkUsingExist == null) {
            const courseId = ctx.cookies.get('courseId', {
                signed: false,
            });
            const usingId = ctx.helper.getSaltyMd5(courseId + sectionId + qId + Math.random() + 10000, 'pusingId');
            await this.ctx.model.Pusing.addUsing(usingId, courseId, sectionId, qId);
        }
        return;
    }

    async addPoster(courseId, poster) {
        const { ctx } = this;
        await ctx.model.Course.changePoster(courseId, poster);
        return;
    }
}

module.exports = teacherAddCourseService;
