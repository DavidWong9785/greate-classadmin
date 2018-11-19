'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Pusing = app.model.define('pusings', {
        // 正在使用的标记
        usingId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 课程id
        courseId: { type: STRING(48), allowNull: false },
        // 节id
        sectionId: { type: STRING(48), allowNull: false },
        // 试题id
        qId: { type: STRING(48), allowNull: false },
        // 课程Id

        created_at: DATE,
        updated_at: DATE,
    });

    // 添加正在使用条目
    Pusing.addUsing = async function (usingId, courseId, sectionId, qId) {
        const p = await this.create({
            usingId,
            courseId,
            sectionId,
            qId
        })
        return p;
    }

    // 检查是否正在使用
    Pusing.checkExist = async function (qId) {
        const p = await this.findOne({
            where: {
                qId,
            }
        })
        return p;
    }

    // 检查是否正在使用(后端验证)
    Pusing.checkUsingExist = async function (qId, sectionId, courseId) {
        const p = await this.findOne({
            where: {
                qId,
                sectionId,
                courseId
            }
        })
        return p;
    }

    Pusing.removeUsing = async function (courseId, sectionId, qId) {
        const p = await this.destroy({
            where: {
                qId,
                courseId,
                sectionId,
            }
        })
        return p;
    }

    return Pusing;
};
