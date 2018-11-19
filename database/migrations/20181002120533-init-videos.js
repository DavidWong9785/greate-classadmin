'use strict';

module.exports = {
    // 在执行数据库升级时调用的函数，创建 videos 表
    up: async (queryInterface, Sequelize) => {
        const { STRING, CHAR, DATE } = Sequelize;
        await queryInterface.createTable('videos', {
            // doc
            doc: { type: STRING(48), allowNull: false },
            // 课程Id
            courseId: { type: STRING(48), allowNull: false },
            // 节Id
            sectionId: { type: STRING(48), allowNull: false, primaryKey: true },
            videoName: STRING(200),
            chapterName: { type: STRING(100), allowNull: false },
            sectionName: { type: STRING(100), allowNull: false },
            cindex: { type: STRING(3), allowNull: false },
            sindex: { type: STRING(3), allowNull: false },
            created_at: DATE,
            updated_at: DATE,
        });
    },
    // 在执行数据库降级时调用的函数，删除 videos 表
    down: async queryInterface => {
        await queryInterface.dropTable('videos');
    },
};
