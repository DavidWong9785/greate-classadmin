'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 papers 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('papers', {
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
    },
    // 在执行数据库降级时调用的函数，删除 papers 表
    down: async queryInterface => {
        await queryInterface.dropTable('papers');
    },
};
