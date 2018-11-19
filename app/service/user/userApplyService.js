'use strict';
const Service = require('egg').Service;

class userApplyService extends Service {
    async handleApply(mail, { teacherName, courseName, courseDesc }) {
        const { ctx } = this;
        // 看是否已经申报了，申报了就更新，没申报就添加
        const haveBeenApply = await ctx.model.Apply.checkMail(mail);
        console.log('haveBeenApply' + haveBeenApply);
        let tag = null;
        if (haveBeenApply !== null) {
            tag = await ctx.model.Apply.updateApplyInfo(mail, teacherName, courseName, courseDesc);
        } else {
            tag = await ctx.model.Apply.addApplyInfo(mail, teacherName, courseName, courseDesc);
        }
        ctx.body = tag;
    }
    async getApplyInfo(token) {
        const { ctx } = this;
        const tag = await ctx.model.Apply.checkMail(token);
        let data = null;
        if (tag === null) {
            data = {
                handleMsg: '暂无申请记录',
                handleStatus: '0',
            };
        } else if (tag.dataValues.handleStatus === '1') {
            data = {
                handleMsg: '正在审核中',
                handleStatus: '1',
            };
        } else if (tag.dataValues.handleStatus === '2') {
            data = {
                handleMsg: tag.dataValues.handleMsg,
                handleStatus: '2',
            };
        }
        return data;
    }
    async checkTeacherName(name, token) {
        const { ctx } = this;
        const tag = await ctx.model.Apply.checkTeacherName(name, token);
        if (tag !== null) {
            return '1';
        }
        return '0';
    }
    async checkCourseName(name, token) {
        const { ctx } = this;
        const tag = await ctx.model.Apply.checkCourseName(name, token);
        if (tag !== null) {
            return '1';
        }
        return '0';
    }
}

module.exports = userApplyService;
