'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 applys 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('applys', {
            mail: { type: STRING(30), allowNull: false, primaryKey: true },
            teacherName: STRING(10),
            courseName: STRING(15),
            courseDesc: STRING(200),
            docPath: STRING(100),
            handleMsg: STRING(100),
            handleStatus: CHAR(1),
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 applys 表
    down: async queryInterface => {
        await queryInterface.dropTable('applys');
    },
};
