'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Question = app.model.define('questions', {
        // 试题id
        qId: { type: STRING(48), allowNull: false, primaryKey: true },
        // 课程Id
        courseId: { type: STRING(48), allowNull: false },
        // 题型
        type: { type: STRING(1) },
        // 题目
        title: { type: STRING(500) },
        // 选项
        options: { type: STRING(500) },
        // 答案
        answer: { type: STRING(1000) },
        // 难度
        difficulty: { type: STRING(1) },

        created_at: DATE,
        updated_at: DATE,
    });

    // 添加试题
    Question.addQuestion = async function(courseId, qId, { type, title, options, answer, difficulty }) {
        options = JSON.stringify(options);
        if (type == '2' || type == '4') {
            answer = JSON.stringify(answer);
        }
        const p = await this.create({
            qId,
            courseId,
            type,
            title,
            options,
            answer,
            difficulty
        });
        return p;
    };

    // 根据过滤条件分页查找试题列表
    Question.getQuestiionByPageAndFilter = async function(courseId, type, difficulty, pageIndex, pageSize) {
        let query = {};
        query.courseId = courseId;
        // 若果种类为0，则不设种类filter
        if (type != '0') {
            query.type = type
        }
        // 若果难度为0，则不设难度filter
        if (difficulty != '0') {
            query.difficulty = difficulty;
        }
        const total = await this.findAll({ 
            where: query
        })
        const arr = await this.findAll({
            limit: pageSize, 
            offset: parseInt((pageIndex-1)*pageSize),
            where: query
        })
        return {
            total: total.length,
            arr
        };
    };

    // 删除试题
    Question.removeQuestion = async function(qId) {
        const p = await this.destroy({
            where: {
                qId,
            },
        });
        return p;
    }

    // 修改试题
    Question.changeQuestion = async function({ qId, type, title, options, answer, difficulty }) {
        options = JSON.stringify(options);
        if (type == '多选题' || type == '填空题') {
            answer = JSON.stringify(answer);
        }
        const p = await this.update({
            title,
            options,
            answer,
            difficulty
        }, {
            where: {
                qId,
            }
        });
        return p;
    }

    // 根据过滤条件分页查找试题列表( 并过滤相应的qId )
    Question.getQuestiionByPageAndFilterQid = async function(courseId, type, difficulty, pageIndex, pageSize, ignore) {
        let query = {};
        query.courseId = courseId;
        // 若果种类为0，则不设种类filter
        if (type != '0') {
            query.type = type
        }
        // 若果难度为0，则不设难度filter
        if (difficulty != '0') {
            query.difficulty = difficulty;
        }
        if (ignore.length > 0) {
            query.qId = {
                '$notIn': ignore
            }
            
        }
        const total = await this.findAll({ 
            where: query
        })
        const arr = await this.findAll({
            limit: pageSize, 
            offset: parseInt((pageIndex-1)*pageSize),
            where: query
        })
        
        return {
            total: total.length,
            arr
        };
    };

    // 根据qId数组查询题目
    Question.getQuestionArrById = async function(qId) {
        const arr = await this.findAll({
            attributes: ['qId', 'title', 'options'],
            where: {
                qId: {
                    '$in': qId
                }
            }
        });
        arr.forEach(element => {
            element.options = JSON.parse(element.options);
        });
        return arr;
    };

    // 根据qId数组查询答案跟信息
    Question.getAnswerByQid = async function(qId) {
        const arr = await this.findOne({
            attributes: ['title', 'type', 'options', 'answer'],
            where: {
                qId,
            }
        });
        try {
            arr.dataValues.options = JSON.parse(arr.dataValues.options);
            if (arr.dataValues.type != 5) {
                arr.dataValues.answer = JSON.parse(arr.dataValues.answer);
            }
        } catch (error) {
            console.log(qId);
            console.log(arr);
        }
        return arr.dataValues;
    };

    // 根据qId数组查询问题题目
    Question.getQuestionTitleByQid = async function(qId) {
        const arr = await this.findOne({
            attributes: ['title'],
            where: {
                qId,
            }
        });
        
        return arr.dataValues.title;
    };

    return Question;
};
