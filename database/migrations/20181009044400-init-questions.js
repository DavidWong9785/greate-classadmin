'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 questions 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('questions', {
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
    },
    // 在执行数据库降级时调用的函数，删除 questions 表
    down: async queryInterface => {
        await queryInterface.dropTable('questions');
    },
};
