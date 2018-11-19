'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 attends 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('attends', {
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
    },
    // 在执行数据库降级时调用的函数，删除 attends 表
    down: async queryInterface => {
        await queryInterface.dropTable('attends');
    },
};
