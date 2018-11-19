'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 exams 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('exams', {
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
    },
    // 在执行数据库降级时调用的函数，删除 exams 表
    down: async queryInterface => {
        await queryInterface.dropTable('exams');
    },
};
