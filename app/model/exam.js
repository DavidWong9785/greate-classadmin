'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Exam = app.model.define('exams', {
        // 考试Id
        examId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 课程Id
        courseId: { type: STRING(48), allowNull: false },
        // 考试名称
        eTitle: { type: STRING(48), allowNull: false },
        // 考试时间
        eTime: { type: STRING(48), allowNull: false },
        // 考试试卷
        paperId: { type: STRING(48), allowNull: false },
        // 考试开始时间
        start: { type: STRING(48), allowNull: false },
        // 考试结束时间
        end: { type: STRING(48), allowNull: false },
        // 报考人数
        count: { type: STRING(5), allowNull: false },
        created_at: DATE,
        updated_at: DATE,
    });

    // 添加考试
    Exam.createExam = async function(examId, courseId, eTitle, eTime, paperId, start, end) {
        return await this.create({
            examId,
            courseId,
            eTitle,
            eTime,
            paperId,
            start,
            end,
            count: '0'
        });
    };

    // 查询考试列表（老师用）
    Exam.getExamList = async function(courseId, findTag) {
        let query = {
            courseId,
        };
        if (findTag == 2) {
            // 未开始
            query.start = {
                '$gt': Date.now(),
            }
        } else if (findTag == 3) {
            // 进行中
            query.start = {
                '$lt': Date.now(),
            }
            query.end = {
                '$gt': Date.now(),
            }
        } else if (findTag == 4) {
            // 已结束
            query.end = {
                '$lt': Date.now(),
            }
        }
        return await this.findAll({
            where: query,
        });
    };

    // 获取所有的考试场次（用户未报名，只显示距离开考前6小时的考试场次）
    Exam.getAllExam = async function (courseId) {
        return await this.findAll({
            where: {
                courseId,
                start: {
                    '$gt': +Date.now()+21600000,
                }
            }
        })
    }

    // 根据examId获取考试信息
    Exam.getExamInfoById = async function (examId) {
        return await this.findOne({
            where: {
                examId
            }
        })
    }

    // 增加报考人数
    Exam.addCount = async function (courseId,examId) {
        const data = await this.findOne({
            attributes: ['count'],
            where: {
                courseId,
                examId
            }
        });
        return await this.update({
            count: (parseInt(data.dataValues.count)+1) + '',
        }, {
            where: {
                examId
            }
        })
    }

    // 获取试卷Id
    Exam.getExamPaperId =  async function (courseId, examId) {
        const p = await this.findOne({
            attributes: ['paperId', 'eTitle', 'start'],
            where: {
                courseId,
                examId
            }
        });
        return p.dataValues;
    }

    // 获取试卷名称
    Exam.getETitleById =  async function (examId) {
        const p = await this.findOne({
            attributes: ['eTitle'],
            where: {
                examId
            }
        });
        return p.dataValues;
    }

    return Exam;
};
