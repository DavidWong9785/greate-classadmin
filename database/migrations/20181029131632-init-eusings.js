'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 eusings 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('eusings', {
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
    },
    // 在执行数据库降级时调用的函数，删除 eusings 表
    down: async queryInterface => {
        await queryInterface.dropTable('eusings');
    },
};
