'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Eusing = app.model.define('eusings', {
        // 正在使用的标记
        usingId: { type: STRING(48), allowNull: false , primaryKey: true },
        // 课程id
        courseId: { type: STRING(48), allowNull: false },
        // 节id
        paperId: { type: STRING(48), allowNull: false },
        // 试题id
        qId: { type: STRING(48), allowNull: false },

        created_at: DATE,
        updated_at: DATE,
    });

    // 添加正在使用条目
    Eusing.addUsing = async function (usingId, courseId, paperId, qId) {
        const p = await this.create({
            usingId,
            courseId,
            paperId,
            qId
        })
        return p;
    }

    // 检查是否正在使用
    Eusing.checkExist = async function (qId) {
        const p = await this.findOne({
            where: {
                qId,
            }
        })
        return p;
    }

    // 检查是否正在使用(后端验证)
    Eusing.checkUsingExist = async function (qId, paperId) {
        const p = await this.findOne({
            where: {
                qId,
                paperId
            }
        })
        return p;
    }

    Eusing.removeUsing = async function (courseId, paperId, qId) {
        const p = await this.destroy({
            where: {
                qId,
                courseId,
                paperId,
            }
        })
        return p;
    }

    Eusing.removeUsingByPaper = async function (paperId) {
        const p = await this.destroy({
            where: {
                paperId,
            }
        })
        return p;
    }



    return Eusing;
};
