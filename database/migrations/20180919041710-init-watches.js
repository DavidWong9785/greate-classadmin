'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 watches 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('watches', {
            // 用户
            mail: { type: STRING(48), allowNull: false, primaryKey: true },
            // 课程Id
            courseId: { type: STRING(48), allowNull: false },
            // 节Id
            sectionId: { type: STRING(48), allowNull: false, primaryKey: true },
            // 视频埋点数
            point: STRING(5),
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 watches 表
    down: async queryInterface => {
        await queryInterface.dropTable('watches');
    },
};
