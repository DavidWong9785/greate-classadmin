'use strict';

module.exports = app => {
    // 在执行数据库升级时调用的函数，创建 counts 表
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Count = app.model.define('counts', {
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

    // 把redis数据写到数据库
    Count.addRedisData = async function(countId, courseId, student, click, pass, fail, time) {
        return await this.create({
            countId, courseId, student, click, pass, fail, time
        });
    };

    // 根据课程Id查找出所有的统计数据，用于图表显示
    Count.getAllDataByCourseId = async function(courseId) {
        return await this.findAll({
            where: {
                courseId,
            }
        });
    };

    return Count;
};
