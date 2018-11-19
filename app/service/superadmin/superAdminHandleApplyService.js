'use strict';
const Service = require('egg').Service;
const fs = require('fs');
const pc = require('../../config/PathConstant');

class superAdminHandleApplyService extends Service {
    async getApplyList(status) {
        const { ctx } = this;
        const tag = await ctx.model.Apply.getApplyList(status);
        return tag;
    }
    async acceptApply(mail) {
        const { ctx, app } = this;
        const acceptTag = await ctx.model.Apply.acceptApply(mail);

        if (acceptTag !== undefined || acceptTag !== null) {
            const { mail, teacherName, courseName, courseDesc } = acceptTag;
            let transaction;
            try {
                transaction = await this.ctx.model.transaction();
                const courseId = ctx.helper.getSaltyMd5(courseName, 'courseName');
                const contentDoc = `${pc.coursedoc}/${ctx.helper.getSaltySha1(courseName, 'courseName')}.json`;
                await fs.writeFile(contentDoc, '[]', { flag: 'w', encoding: 'utf-8', mode: '0666' }, function(err) {

                });
                await ctx.helper.makeDir(`${pc.video}/${courseId}`);
                await ctx.helper.makeDir(`${pc.ppt}/${courseId}`);
                // 把埋点数据放入redis
                await app.redis.get('count').set(courseId, JSON.stringify({
                    newStudents: '0',
                    clickTimes: '0',
                    passCount: '0',
                    failCount: '0',
                    newComments: '0',
                }));
                // 提升用户级别
                await ctx.model.User.updateTag(mail, '2', transaction);
                // 写入老师表
                await ctx.model.Teacher.addTeacher(mail, teacherName, courseId, transaction);
                // 写入课程表
                await ctx.model.Course.addCourse(courseId, teacherName, courseName, courseDesc, contentDoc, transaction);
                await transaction.commit();
                return true;
            } catch (e) {
                console.log(e);
                await transaction.rollback();
                return false;
            }
        }
        return null;
    }
    async backApply(mail, handleMsg) {
        const { ctx } = this;
        const tag = await ctx.model.Apply.backApply(mail, handleMsg);
        return tag;
    }
    async removeApply(mail) {
        const { ctx } = this;
        let oldDoc = await ctx.model.Apply.removeApply(mail);
        if (oldDoc == null) {
            return;
        }
        oldDoc = oldDoc.substring(oldDoc.lastIndexOf('/') + 1, oldDoc.length);
        await fs.unlink(`${pc.applydoc}/${oldDoc}`);
        return oldDoc;
    }
}

module.exports = superAdminHandleApplyService;
