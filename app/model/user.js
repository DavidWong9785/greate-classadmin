'use strict';
const pehelper = require('../extend/crypto/PasswordEncrypt');

module.exports = app => {
    // 在执行数据库升级时调用的函数，创建 users 表
    const { STRING, CHAR, DATE } = app.Sequelize;
    const User = app.model.define('users', {
        mail: { type: STRING(30), allowNull: false, primaryKey: true },
        password: STRING(100),
        username: STRING(16),
        avatar: STRING(100),
        sex: CHAR(1),
        tag: CHAR(1),
        created_at: DATE,
        updated_at: DATE,
    });

    // 查找是否已经注册
    User.checkUser = async function(mail) {
        return await this.findOne({
            where: {
                mail,
            },
        });
    };

    // 查找用户名是否已经存在
    User.checkUsername = async function(username) {
        return await this.findOne({
            where: {
                username,
            },
        });
    };

    // 注册
    User.addUser = async function(mail, password, username) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkUser = await User.checkUser(mail);
        const checkUsername = await User.checkUsername(username);
        if (checkUser != null || checkUsername != null) {
            return;
        }
        return await this.create({
            mail,
            password: pehelper.encryptBySalt(password),
            // 用户名
            username,
            // 默认头像
            avatar: 'http://127.0.0.1:8089/avatar/defaultAvatar.jpg',
            // 性别默认保密，男1女2保密3
            sex: '3',
            // 默认没有描述
            tag: '1',
        });
    };

    User.updateTag = async function(mail, tag, transaction) {
        return await this.update({
            tag,
        }, {
            where: {
                mail,
            },
            transaction,
        });
    };

    User.getUsernameByMail = async function(mail) {
        const p = await this.findOne({
            attributes: ['username'],
            where: {
                mail,
            },
        });
        return p.dataValues.username;
    };

    return User;
};
