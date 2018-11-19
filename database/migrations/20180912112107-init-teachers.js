'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 teachers 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('teachers', {
            mail: { type: STRING(30), allowNull: false, primaryKey: true },
            teacherName: STRING(10),
            courseId: STRING(48),
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 teachers 表
    down: async queryInterface => {
        await queryInterface.dropTable('teachers');
    },
};
