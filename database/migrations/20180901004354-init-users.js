'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 users 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('users', {
            mail: { type: STRING(30), allowNull: false, primaryKey: true },
            password: STRING(100),
            username: STRING(16),
            avatar: STRING(100),
            sex: CHAR(1),
            tag: CHAR(1),
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 users 表
    down: async queryInterface => {
        await queryInterface.dropTable('users');
    },
};
