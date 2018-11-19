'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 courses 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('courses', {
            courseId: { type: STRING(48), allowNull: false, primaryKey: true },
            teacherName: STRING(10),
            courseName: STRING(15),
            courseDesc: STRING(200),
            contentDoc: STRING(100),
            poster: STRING(100),
            teacherDesc: STRING(100),
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 courses 表
    down: async queryInterface => {
        await queryInterface.dropTable('courses');
    },
};
