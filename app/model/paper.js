'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Paper = app.model.define('papers', {
        // 考卷Id
        paperId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 考卷名字
        paperName: { type: STRING(20), allowNull: false, },
        // 课程id
        courseId: { type: STRING(48), allowNull: false },
        // 单选题
        single: { type: STRING(600), },
        // 多选题
        multiple: { type: STRING(200), },
        // 判断题
        judge: { type: STRING(220), },
        // 填空题
        gap: { type: STRING(200), },
        // 简答题
        short: { type: STRING(100), },
        // 状态
        status: { type: STRING(1), },

        created_at: DATE,
        updated_at: DATE,
    });

    // 添加考卷
    Paper.createPaper = async function (paperId, courseId, paperName) {
        const arr = JSON.stringify([]);
        const p = await this.create({
            paperId,
            courseId,
            paperName,
            status: '0',
            single: arr,
            multiple: arr,
            judge: arr,
            gap: arr,
            short: arr,
        })
        return p;
    }

    // 删除考卷
    Paper.removePaper = async function (paperId) {
        const p = await this.destroy({
            where: {
                paperId,
            }
        })
        return p;
    }

    // 添加考题到试卷
    Paper.addQuestionToPaper = async function (question, paperId) {
        const query = {};
        query[question["type"]] = question.data;
        const p = await this.update(query, {
            where: {
                paperId,
            },
        })
        return p;
    }

    // 检查考卷名字是否已经存在
    Paper.checkPaperName = async function (courseId, paperName) {
        const p = await this.findOne({
            where: {
                courseId,
                paperName
            }
        })
        return p;
    }

    // 获取考卷列表
    Paper.getPaperList = async function (courseId) {
        const p = await this.findAll({
            attributes: ['paperId', 'paperName', 'status'],
            where: {
                courseId,
            }
        })
        return p;
    }
    
    // 获取考卷详情
    Paper.getPaperDetail = async function (paperId) {
        const p = await this.findOne({
            where: {
                paperId,
            }
        })
        p.dataValues.single = JSON.parse(p.dataValues.single);
        p.dataValues.multiple = JSON.parse(p.dataValues.multiple);
        p.dataValues.judge = JSON.parse(p.dataValues.judge);
        p.dataValues.gap = JSON.parse(p.dataValues.gap);
        p.dataValues.short = JSON.parse(p.dataValues.short);
        return p.dataValues;
    }

    // 获取考卷详情
    Paper.getPaperJustDetail = async function (paperId) {
        const p = await this.findOne({
            attributes: ['single', 'multiple', 'judge', 'gap', 'short'],
            where: {
                paperId,
            }
        })
        p.dataValues.single = JSON.parse(p.dataValues.single);
        p.dataValues.multiple = JSON.parse(p.dataValues.multiple);
        p.dataValues.judge = JSON.parse(p.dataValues.judge);
        p.dataValues.gap = JSON.parse(p.dataValues.gap);
        p.dataValues.short = JSON.parse(p.dataValues.short);
        return p.dataValues;
    }

    Paper.changeStatus = async function (paperId) {
        const p = await this.update({
            status: '1',
        },{
            where: {
                paperId,
            }
        })
        return p;
    }

    Paper.checkStatus = async function (paperId) {
        const p = await this.findOne({
            attributes: ['status'],
            where: {
                paperId,
            }
        })
        return p;
    }

    // 获取考卷填空题简答题答案
    Paper.getGSAnswer = async function (paperId) {
        const p = await this.findOne({
            attributes: ['gap', 'short'],
            where: {
                paperId,
            }
        })
        p.dataValues.gap = JSON.parse(p.dataValues.gap);
        p.dataValues.short = JSON.parse(p.dataValues.short);
        return p.dataValues;
    }

    return Paper;
};
