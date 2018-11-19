'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Attend = app.model.define('attends', {
        // 参加Id
        attendId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 用户Id
        mail: { type: STRING(48), allowNull: false },
        // 考试Id
        examId: { type: STRING(48), allowNull: false },
        // 课程Id
        courseId: { type: STRING(48), allowNull: false },
        // 考试状态
        status: { type: STRING(1), allowNull: false },
        // 单选题
        single: { type: STRING(3)},
        // 多选题
        multiple: { type: STRING(3) },
        // 判断题
        judge: { type: STRING(3) },
        // 填空题
        gap: { type: STRING(3) },
        // 简答题
        short: { type: STRING(3) },
        created_at: DATE,
        updated_at: DATE,
    });

    // 报名考试
    Attend.attendExam = async function(attendId, mail, examId, courseId) {
        return await this.create({
            attendId,
            mail,
            examId,
            courseId,
            status: '1',
            single: '0',
            multiple: '0',
            judge: '0',
            gap: '0',
            short: '0',
        });
    };

    // 统计报考人数（老师用）
    Attend.getExamList = async function(courseId, examId) {
        const p = await this.findAll({
            where: {
                courseId, examId
            },
        })
        return p.dataValues.length;
    };

    // 检查用户是否已经报考
    Attend.checkAttend = async function(courseId, mail) {
        const p = await this.findOne({
            where: {
                courseId,
                mail
            },
        })
        return p;
    };

    // 检查用户是否已经报考
    Attend.changeAttendStatus = async function(courseId, mail, status) {
        const p = await this.update({
            status,
        }, {
            where: {
                courseId,
                mail
            },
        })
        return p;
    };

    // 当请求exam信息时，状态为2就要删除掉attend
    Attend.removeAttend = async function(courseId, mail) {
        const p = await this.destroy({
            where: {
                courseId,
                mail
            },
        });
        return p;
    };

    // 获取ExamId
    Attend.getExamId = async function(courseId, mail) {
        const p = await this.findOne({
            attributes: ['examId'],
            where: {
                courseId,
                mail
            },
        });
        return p.dataValues;
    };

    // 更改attend状态
    Attend.changeStatus = async function(courseId, mail, status) {
        const p = await this.update({
            status,
        }, {
            where: {
                courseId,
                mail
            },
        });
        return p;
    };

    // 添加single，multiple，judge成绩
    Attend.addSMJScorce = async function(single, multiple, judge, courseId, mail, examId) {
        const p = await this.update({
            single, multiple, judge
        }, {
            where: {
                courseId,
                mail,
                examId,
            },
        });
        return p;
    };

    // 添加single，multiple，judge成绩
    Attend.getSMJScorce = async function(courseId, mail, examId) {
        const p = await this.findOne({
            attributes: ['single', 'multiple', 'judge'],
            where: {
                courseId,
                mail,
                examId,
            },
        });
        return p.dataValues;
    };

    // 老师获待批改考卷列表
    Attend.getExamCorrectList = async function(courseId) {
        const p = await this.findAll({
            attributes: ['mail', 'examId'],
            where: {
                courseId,
                status: '3',
                gap: '0',
                short: '0',
            },
        });
        return p;
    };

    // 老师获待批改考卷列表
    Attend.checkCorrect = async function(courseId, mail) {
        const p = await this.findOne({
            attributes: ['status'],
            where: {
                courseId, mail
            },
        });
        return p.dataValues.status == '3' ? true : false;
    };

    // 老师获待批改考卷列表
    Attend.finishCorrect = async function(courseId, examId, mail, gap, short) {
        await this.update({
            gap, short, status: '4'
        }, {
            where: {
                courseId, mail, examId
            },
        });
        const p = await this.findOne({
            attributes: ['single', 'multiple', 'judge', 'gap', 'short'],
            where: {
                courseId, examId, mail
            }
        })
        return p.dataValues;
    };

    return Attend;
};
