'use strict';

module.exports = app => {
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Apply = app.model.define('applys', {
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

    // 查找mail是否已经存在
    Apply.checkMail = async function(mail) {
        return await this.findOne({
            where: {
                mail,
            },
        });
    };

    // 查找teacherName是否已经存在
    Apply.checkTeacherName = async function(teacherName) {
        return await this.findOne({
            where: {
                teacherName,
            },
        });
    };

    // 查找courseName是否已经存在
    Apply.checkCourseName = async function(courseName) {
        return await this.findOne({
            where: {
                courseName,
            },
        });
    };

    // 注册
    Apply.addApplyInfo = async function(mail, teacherName, courseName, courseDesc) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkMail = await Apply.checkMail(mail);
        const checkTeacherName = await Apply.checkMail(teacherName);
        const checkCourseName = await Apply.checkCourseName(courseName);
        if (checkMail != null || checkTeacherName != null || checkCourseName != null) {
            return;
        }
        return await this.create({
            mail,
            // 老师名字
            teacherName,
            // 课程名字
            courseName,
            // 课程介绍
            courseDesc,
            // 处理信息
            handleMsg: '正在审核中',
            // 处理状态
            handleStatus: '1',
        });
    };

    // 更新（用于申报打回后的提交）
    Apply.updateApplyInfo = async function(mail, teacherName, courseName, courseDesc) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkTeacherName = await Apply.checkMail(teacherName);
        const checkCourseName = await Apply.checkCourseName(courseName);
        if (checkTeacherName != null || checkCourseName != null) {
            return;
        }
        return await this.update({
            // 老师名字
            teacherName,
            // 课程名字
            courseName,
            // 课程介绍
            courseDesc,
            // 处理信息
            handleMsg: '正在审核中',
            // 处理状态
            handleStatus: '1',
        }, {
            where: {
                mail,
            },
        });
    };

    // 申报打回
    Apply.backApply = async function(mail, handleMsg) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkMail = await Apply.checkMail(mail);
        if (checkMail == null) {
            return;
        }
        return await this.update({
            handleMsg,
            handleStatus: '2',
        }, {
            where: {
                mail,
            },
        });
    };

    // 删除
    Apply.removeApply = async function(mail) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkMail = await Apply.checkMail(mail);
        if (checkMail == null) {
            return;
        }
        await this.destroy({
            where: {
                mail,
            },
        });
        return checkMail.dataValues.docPath;
    };

    // 通过申报
    Apply.acceptApply = async function(mail) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkMail = await Apply.checkMail(mail);
        if (checkMail == null) {
            return;
        }
        await this.update({
            handleMsg: '审核通过',
            handleStatus: '3',
        }, {
            where: {
                mail,
            },
        });
        return checkMail.dataValues;
    };

    Apply.updateDocPath = async function(mail, docPath) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkMail = await Apply.checkMail(mail);
        const p = await this.update({
            docPath,
        }, {
            where: {
                mail,
            },
        });
        if (checkMail === null) {
            return null;
        }
        return checkMail.dataValues.docPath;
    };

    // 根据状态条件查找信息
    Apply.getApplyList = async function(handleStatus) {
        if (handleStatus === '0') {
            return await this.findAll();
        }
        return await this.findAll({
            where: {
                handleStatus,
            },
        });
    };


    return Apply;
};
