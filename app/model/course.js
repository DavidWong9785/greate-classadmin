'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Course = app.model.define('courses', {
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

    // 添加课程
    Course.addCourse = async function(courseId, teacherName, courseName, courseDesc, contentDoc, transaction) {
        return await this.create({
            courseId,
            teacherName,
            courseName,
            courseDesc,
            contentDoc,
            poster: 'http://localhost:8089/poster/defaultPoster.jpg',
            teacherDesc: '暂没有这位讲师的介绍信息',
        }, {
            transaction,
        });
    };

    // 获取课程信息
    Course.getCourseInfo = async function(courseId) {
        const data = await this.findOne({
            where: {
                courseId,
            },
        });
        return data.dataValues;
    };

    // 更改课程介绍
    Course.changeCourseDesc = async function(courseDesc, courseId) {
        const data = await this.update({
            courseDesc,
        }, {
            where: {
                courseId,
            },
        });
        return data;
    };

    // 更改讲师介绍
    Course.changeTeacherDesc = async function(teacherDesc, courseId) {
        const data = await this.update({
            teacherDesc,
        }, {
            where: {
                courseId,
            },
        });
        return data;
    };

    Course.changePoster = async function(courseId, poster) {
        const data = await this.update({
            poster,
        }, {
            where: {
                courseId,
            },
        });
        return data;
    };

    Course.getCourseList = async function(courseId, poster) {
        const data = await this.findAll();
        return data;
    };

    Course.getCourseIntroduce = async function(courseId) {
        const data = await this.findOne({
            where: {
                courseId
            }
        });
        return data;
    }

    Course.getCourseNameById = async function(courseId) {
        const data = await this.findOne({
            attributes: ['courseName'],
            where: {
                courseId
            }
        });
        return data.dataValues.courseName;
    }

    return Course;
};
