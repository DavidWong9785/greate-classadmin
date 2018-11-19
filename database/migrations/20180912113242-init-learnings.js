'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 learnings 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('learnings', {
            // learningId
            learningId: { type: STRING(48), allowNull: false, primaryKey: true },
            // 用户ID
            mail: { type: STRING(30), allowNull: false, primaryKey: true },
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
    },
    // 在执行数据库降级时调用的函数，删除 learnings 表
    down: async queryInterface => {
        await queryInterface.dropTable('learnings');
    },
};
