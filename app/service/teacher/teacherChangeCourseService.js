'use strict';
const Service = require('egg').Service;
const pc = require('../../config/PathConstant');

class teacherChangeCourseService extends Service {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    async changeCourseDesc(courseDesc, courseId) {
        const { ctx } = this;
        const data = await ctx.model.Course.changeCourseDesc(courseDesc, courseId);
        return data;
    }

    async changeTeacherDesc(teacherDesc, courseId) {
        const { ctx } = this;
        const data = await ctx.model.Course.changeTeacherDesc(teacherDesc, courseId);
        return data;
    }

    // 修改试题
    async changeQuestion(question) {
        const { ctx } = this;
        const data = await ctx.model.Question.changeQuestion(question);
        return data;
    }

    // 修改章名字
    async changeChapterName(doc, chapterName, cindex) {
        const { ctx } = this;
        let data;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        data[cindex].chapterName = chapterName;
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return data;
    }

    // 修改节名字
    async changeSectionName(doc, sectionName, cindex, sindex) {
        const { ctx } = this;
        let data;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        
        data[cindex].section[sindex].sectionName = sectionName;
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return data;
    }

}

module.exports = teacherChangeCourseService;
