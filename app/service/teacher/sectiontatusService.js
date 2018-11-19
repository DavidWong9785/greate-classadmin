'use strict';
const Service = require('egg').Service;
const pc = require('../../config/PathConstant');

class sectiontatusService extends Service {

    async checkSection(doc, cindex, sindex) {
        const { ctx } = this;
        const data = await ctx.helper.readFile(`${pc.coursedoc}/${doc}.json`);
        const videoCheck = data[cindex].section[sindex].video;
        if (videoCheck != '2') {
            return '0';
        }
        const pptCheck = data[cindex].section[sindex].ppt;
        if (pptCheck == false) {
            return '0';
        }
        const practiceCheck = data[cindex].section[sindex].practice;
        if (practiceCheck.length !== 5) {
            return '0';
        }
        data[cindex].section[sindex].status = '1';
        await ctx.helper.writeFile(`${pc.coursedoc}/${doc}.json`, JSON.stringify(data));
        return '1';
    }

}

module.exports = sectiontatusService;
