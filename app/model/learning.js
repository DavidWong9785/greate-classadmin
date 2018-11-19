'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Learning = app.model.define('learnings', {
        // learningId
        learningId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 用户ID
        mail: { type: STRING(30), allowNull: false },
        // 课程ID
        courseId: { type: STRING(48), allowNull: false },
        // 平时成绩 (占40%)
        learnSorce: STRING(3),
        // 考试成绩 (占60%)
        examSorce: STRING(3),
        // 最终成绩
        finalSorce: STRING(3),
        created_at: DATE,
        updated_at: DATE,
    });

    Learning.userAttendLearning = async function(learningId, mail, courseId) {
        return await this.create({
            learningId,
            mail,
            courseId,
        });
    }

    Learning.userCheckHaveAttend = async function({mail, courseId}) {
        return await this.findOne({
            where: {
                mail,
                courseId
            }
        });
    }

    Learning.userComputedLearningScore = async function(mail, courseId, learnSorce) {
        return await this.update({
            learnSorce,
        }, {
            where: {
                mail,
                courseId
            }
        });
    }

    Learning.checkLearinScore = async function (courseId, mail) {
        return await this.findOne({
            attributes: ['learnSorce'],
            where: {
                mail,
                courseId
            }
        });
    }

    Learning.checkExamScore = async function (courseId, mail) {
        return await this.findOne({
            attributes: ['examSorce'],
            where: {
                mail,
                courseId
            }
        });
    }

    Learning.addFinalScore = async function (courseId, mail, examSorce) {
        await this.update({
            examSorce
        },{
            where: {
                mail,
                courseId
            }
        });

        const data = await this.findOne({
            attributes: ['learnSorce'],
            where: {
                mail,
                courseId
            }
        });

        const finalSorce = parseInt(data.dataValues.learnSorce * 0.4 + examSorce * 0.6);
        await this.update({
            finalSorce
        },{
            where: {
                mail,
                courseId
            }
        });

        return;
    }

    Learning.getScoreByMail = async function(mail) {
        const p = await this.findAll({
            where: {
                mail
            },
        })
        return p;
    }

    Learning.getInfoListByCourseId = async function(courseId, pageIndex, pageSize, filter) {
        let query = {};
        query.courseId = courseId;
        if (filter == '1') {
            query.learnSorce = null;
        } else if (filter == '2') {
            query.learnSorce = {
                '$ne': null,
            };
            query.finalSorce = {
                '$eq': null,
            };;
        } else if (filter == '3') {
            query.finalSorce = {
                '$ne': null,
            };;
        }
        const p = await this.findAll({
            attributes: ['mail', 'learnSorce', 'examSorce', 'finalSorce'],
            limit: pageSize, 
            offset: parseInt((pageIndex-1)*pageSize),
            where: query
        })
        return p;
    }

    return Learning;
};
