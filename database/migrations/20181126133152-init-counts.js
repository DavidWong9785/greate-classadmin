'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 counts 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('counts', {
            // 统计Id
            countId: { type: STRING(48), allowNull: false, primaryKey: true },
            // 课程Id
            courseId: { type: STRING(48), allowNull: false },
            // 新学生
            student: { type: STRING(10), allowNull: false },
            // 点击数
            click: { type: STRING(20), allowNull: false },
            // 通过人数
            pass: { type: STRING(20), allowNull: false },
            // 挂科人数
            fail: { type: STRING(20), allowNull: false},
            // 时间
            time: { type: STRING(20), allowNull: false },
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 counts 表
    down: async queryInterface => {
        await queryInterface.dropTable('counts');
    },
};
