'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Final = app.model.define('finals', {
        // finalId
        finalId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 用户Id
        mail: { type: STRING(48), allowNull: false },
        // 考试Id
        examId: { type: STRING(48), allowNull: false },
        // 课程Id
        courseId: { type: STRING(48), allowNull: false },
        // 单选题
        single: { type: STRING(2500)},
        // 多选题
        multiple: { type: STRING(2500) },
        // 判断题
        judge: { type: STRING(2500) },
        // 填空题
        gap: { type: STRING(2500) },
        // 简答题
        short: { type: STRING(2500) },
        created_at: DATE,
        updated_at: DATE,
    });
    
    Final.addFinal = async function (finalId, mail, examId, courseId, single, multiple, judge, gap, short) {
        return this.create({
            finalId, mail, examId, courseId, single, multiple, judge, gap, short
        })
    }
    
    Final.getGSAnswer = async function (courseId, mail, examId) {
        const p = await this.findOne({
            attributes: ['gap', 'short'],
            where: {
                courseId, mail, examId
            }
        });
        p.dataValues.gap = JSON.parse(p.dataValues.gap);
        p.dataValues.short = JSON.parse(p.dataValues.short);
        return p;
    }

    return Final;
};
