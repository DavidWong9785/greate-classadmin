'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Teacher = app.model.define('teachers', {
        mail: { type: STRING(30), allowNull: false, primaryKey: true },
        teacherName: STRING(10),
        courseId: STRING(48),
        created_at: DATE,
        updated_at: DATE,
    });

    // 添加老师
    Teacher.addTeacher = async function(mail, teacherName, courseId, transaction) {
        const p = await this.create({
            mail,
            teacherName,
            courseId,
        }, {
            transaction,
        });
        return p;
    };

    // 根据mail获取课程id
    Teacher.getCourseId = async function(mail) {
        const p = await this.findOne({
            where: {
                mail,
            },
        });
        return p.dataValues.courseId;
    };

    // 检查mail跟courseId是否匹配
    Teacher.checkTeacher = async function(mail, courseId) {
        const p = await this.findOne({
            where: {
                mail,
                courseId,
            },
        });
        return p;
    };

    return Teacher;
};
