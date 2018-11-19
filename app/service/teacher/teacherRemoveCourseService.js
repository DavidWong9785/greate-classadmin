'use strict';
const Service = require('egg').Service;
const pc = require('../../config/PathConstant');
const path = require('path');

class teacherRemoveCourseService extends Service {
    async options() {
        const { ctx } = this;
        ctx.set('Access-Control-Allow-Method', 'POST');
        ctx.status(204);
    }

    // 删除章
    async removeChapter(cindex, doc, courseId) {
        const { ctx, app } = this;
        let data = null;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        // 必须是空的章才能删除
        if (data[cindex].section.length > 0) {
            return;
        }
        for (let i = 0; i < data[cindex].section.length; i++) {
            // 删除视频，如果视频还在审核，就把审核表数据也删掉
            if (data[cindex].section[i].video === '1' || data[cindex].section[i].video === '3') {
                await ctx.model.Video.removeVideoApply(data[cindex].section[i].sectionId);
            }
            // 删除video
            await ctx.helper.removeDir(path.join(pc.video, courseId, data[cindex].section[i].sectionId), app);
            // 删除ppt
            await ctx.helper.removeDir(path.join(pc.ppt, courseId, data[cindex].section[i].sectionId), app);
        }
        // 删除完毕后修改数组并写入文件
        data.splice(cindex, 1);
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return data;
    }

    // 删除节
    async removeSection(cindex, sindex, doc, courseId) {
        const { ctx, app } = this;
        let data = null;
        try {
            data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        } catch (error) {
            return 'invalid message';
        }
        // 必须是未上线的节才能删除
        if (data[cindex].section[sindex].status === 1) {
            return;
        }
        // 删除视频
        await ctx.helper.removeDir(`${pc.video}/${courseId}/${data[cindex].section[sindex].sectionId}`, app);
        // 删除课件
        await ctx.helper.removeDir(`${pc.ppt}/${courseId}/${data[cindex].section[sindex].sectionId}`, app);

        data[cindex].section.splice(sindex, 1);
        
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return data;
    }

    // 删除试题
    async removeQuestion(qId) {
        const { ctx } = this;
        const checkPusingExist = await ctx.model.Pusing.checkExist(qId);
        if (checkPusingExist != null || checkPusingExist != undefined) {
            return 'using';
        }
        const checkEusingExist = await ctx.model.Eusing.checkExist(qId);
        if (checkEusingExist != null || checkEusingExist != undefined) {
            return 'using';
        }
        const data = await ctx.model.Question.removeQuestion(qId);
        return data;
    }

    // 从练习移除试题
    async removeQuestionFromPractice(doc, courseId, sectionId, cindex, sindex, qId, qindex) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        data[cindex].section[sindex].practice.splice(qindex, 1);
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        // 不从pusing中删除，因为考虑到后续老师会修改题目，但有的学生已经做过题目了，从试题库再删除是不合适的，所以一旦用过，状态便会保留
        const removePusing = await ctx.model.Pusing.removeUsing(courseId, sectionId, qId);
        return removePusing;
    }
}

module.exports = teacherRemoveCourseService;
