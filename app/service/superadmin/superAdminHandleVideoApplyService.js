'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');
const ffmpeg = require('fluent-ffmpeg');

class superAdminHandleVideoApplyService extends Service {
    async getVideoApplyList(status) {
        const { ctx } = this;
        const data = await ctx.model.Video.getVideoApplyList(status);
        return data;
    }
    async acceptApply({ doc, courseId, sectionId, cindex, sindex }) {
        const { ctx } = this;
        const videoPath = `${pc.video}/${courseId}/${sectionId}/prod`;
        if (!fs.existsSync(videoPath)) {
            fs.mkdirSync(videoPath);
        }
        // const command = ffmpeg(`${pc.video}/${courseId}/${sectionId}/prepare.avi`)
        // .videoCodec('libx264')
        // .audioCodec('libmp3lame')
        // .output(`${pc.video}/${courseId}/${sectionId}/prod/hd.avi`)
        // .videoBitrate('200k')
        // .videoCodec('libx264')
        // .audioCodec('libmp3lame')
        // .output(`${pc.video}/${courseId}/${sectionId}/prod/sd.avi`)
        // .videoBitrate('150k')
        // .videoCodec('libx264')
        // .audioCodec('libmp3lame')
        // .output(`${pc.video}/${courseId}/${sectionId}/prod/ld.avi`)
        // .videoBitrate('100k')
        // .on('end', async function() {
            await ctx.service.superadmin.superAdminHandleVideoApplyService.finishtransCode(doc, sectionId, cindex, sindex);
        // })
        // .run();
        return 'finish';
    }

    async finishtransCode(doc, sectionId, cindex, sindex) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        data[cindex].section[sindex].video = '2';
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        if (data[cindex].section[sindex].status !== 1) {
            await ctx.service.teacher.sectiontatusService.checkSection(doc, cindex, sindex);
        }
        await ctx.model.Video.removeVideoApply(sectionId);
    }

    async backApply({ doc, courseId, sectionId, cindex, sindex }) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        data[cindex].section[sindex].video = '3';
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        await ctx.model.Video.removeVideoApply(sectionId);
        return 'notAccept';
    }

}

module.exports = superAdminHandleVideoApplyService;
