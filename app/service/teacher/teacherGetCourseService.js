'use strict';
const Service = require('egg').Service;
const pc = require('../../config/PathConstant');

class teacherGetCourseService extends Service {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 获取课程信息
    async getCourseInfo(mail) {
        const { ctx } = this;
        const courseId = await ctx.model.Teacher.getCourseId(mail);
        const data = await ctx.model.Course.getCourseInfo(courseId);
        return {
            courseId,
            teacherName: data.teacherName,
            courseName: data.courseName,
            courseDesc: data.courseDesc,
            poster: data.poster,
            teacherDesc: data.teacherDesc
        };
    }

    // 判断章名字是否已经存在
    async checkCSName(name, doc) {
        const { ctx } = this;
        let data = null;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        try {
            data.forEach((citem, cindex) => {
                if (citem.chapterName === name) throw '0';
                citem.section.forEach((sitem, sindex) => {
                    if (sitem.sectionName === name) {
                        throw '0';
                    }
                });
            });
        } catch (error) {
            return '0';
        }
        return '1';
    }

    // 获取课程列表
    async getCourseList(doc) {
        const { ctx } = this;
        let data = null;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        return data;
    }

    // 获取试题列表
    async getQuestionList(courseId, type, difficulty, pageIndex, pageSize) {
        const { ctx } = this;
        const data = await ctx.model.Question.getQuestiionByPageAndFilter(courseId, type, difficulty, pageIndex, pageSize);
        return {...data};
    }

    // 获取试题列表(过滤相应qId)
    async getQuestionListFilterQid(courseId, type, difficulty, pageIndex, pageSize, ignore) {
        const { ctx } = this;
        const data = await ctx.model.Question.getQuestiionByPageAndFilterQid(courseId, type, difficulty, pageIndex, pageSize, ignore);
        return {...data};
    }
    
    // 获取课程内容detail
    async teacherGetCourseDetailBysectionId(doc, cindex, sindex) {
        const { ctx } = this;
        let data;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        let practice = [];
        if (data[cindex].section[sindex].practice.length != 0) {
            for (let i = 0; i < 5; i++) {
                const qId = data[cindex].section[sindex].practice[i].qId;
                const title = await ctx.model.Question.getQuestionTitleByQid(qId);
                practice.push({
                    qId,
                    title,
                });
            }
        }
        data[cindex].section[sindex].practice = practice;
        const detail = {
            chapterName: data[cindex].chapterName,
            sectionName: data[cindex].section[sindex].sectionName,
            sectionId: data[cindex].section[sindex].sectionId,
            video: data[cindex].section[sindex].video,
            ppt: data[cindex].section[sindex].ppt,
            practice,
            status: data[cindex].section[sindex].status,
            cindex,
            sindex
        }
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return detail;
    }

    // 老师获取课程统计信息
    async teacherGetCountInfo(courseId) {
        const { app } = this;
        let data = await app.redis.get('count').get(courseId);
        if (data != null) {
            data = JSON.parse(data);
        } else {
            data = {
                student: 0,
                click: 0,
                pass: 0,
                fail: 0,
            }
            await app.redis.get('count').set(courseId, JSON.stringify(data));
        }
        return data;
    }
}

module.exports = teacherGetCourseService;
