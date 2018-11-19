'use strict';
const pehelper = require('../extend/crypto/PasswordEncrypt');

function toInt(str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
}

module.exports = app => {
    // 在执行数据库升级时调用的函数，创建 users 表
    const { STRING, CHAR, DATE } = app.Sequelize;
    const Admin = app.model.define('admins', {
        userId: { type: STRING(30), allowNull: false, primaryKey: true },
        password: STRING(100),
        username: STRING(16),
        avatar: STRING(100),
        access: CHAR(1),
        status: CHAR(1),
        created_at: DATE,
        updated_at: DATE,
    });

    // 查找管理员账号是否已经存在
    Admin.checkAdmin = async function(userId) {
        return await this.findOne({
            where: {
                userId,
            },
        });
    };

    // 查找管理员用户名是否已经存在
    Admin.checkAdminUsername = async function(username) {
        return await this.findOne({
            where: {
                username,
            },
        });
    };

    // 权限检查(执行者ID，执行对象权限)，如果执行者权限比执行对象低，那就返回true
    Admin.checkAccess = async function(userId, userId2Access) {
        try {
            const admin = await this.findOne({
                where: {
                    userId,
                },
            });
            if (admin == null) {
                return true;
            }
            return admin.dataValues.access < userId2Access;
        } catch (error) {
            return true;
        }
    };

    // 锁定管理员
    Admin.lockAdmin = async function(userId, token) {
        const admin = await this.findOne({
            where: {
                userId,
            },
        });
        if (admin != null) {
            const accessTag = await Admin.checkAccess(token, admin.dataValues.access);
            if (accessTag === true) {
                return '0';
            }
            await this.update({
                status: '0',
            }, {
                where: {
                    userId,
                },
            });
            return '1';
        }
        return '0';
    };

    // 解锁管理员
    Admin.unLockAdmin = async function(userId, token) {
        const admin = await this.findOne({
            where: {
                userId,
            },
        });
        if (admin != null) {
            const accessTag = await Admin.checkAccess(token, admin.dataValues.access);
            if (accessTag === true) {
                return '0';
            }
            await this.update({
                status: '1',
            }, {
                where: {
                    userId,
                },
            });
            return '1';
        }
        return '0';
    };

    // 管理员升级
    Admin.upgradeAdmin = async function(userId, token) {
        const admin = await this.findOne({
            where: {
                userId,
            },
        });
        if (admin != null) {
            const accessTag = await Admin.checkAccess(token, admin.dataValues.access);
            if (accessTag === true) {
                return '0';
            }
            let newAccess = toInt(admin.dataValues.access) + 1;
            await this.update({
                access: newAccess >= 5 ? --newAccess : newAccess,
            }, {
                where: {
                    userId,
                },
            });
            return '1';
        }
        return '0';
    };

    // 管理员降级
    Admin.demoteAdmin = async function(userId, token) {
        const admin = await this.findOne({
            where: {
                userId,
            },
        });
        if (admin != null) {
            const accessTag = await Admin.checkAccess(token, admin.dataValues.access);
            if (accessTag === true) {
                return '0';
            }
            let newAccess = toInt(admin.dataValues.access) - 1;
            await this.update({
                access: newAccess === 0 ? ++newAccess : newAccess,
            }, {
                where: {
                    userId,
                },
            });
            return '1';
        }
        return '0';
    };

    // 查找管理员信息列表
    Admin.getAdminList = async function(access) {
        if (access === '1') {
            return await app.model.query('SELECT * FROM admins WHERE access = ?', {
                replacements: [ access ] });
        }
        return await app.model.query('SELECT * FROM admins WHERE access < ?', {
            replacements: [ access ] });
    };

    // 添加管理员
    Admin.addAdmin = async function(admin, { userId, username, password, access }) {
        // 先检查是否已存在信息，存在就不在往下执行
        const checkAdmin = await Admin.checkAdmin(userId);
        const checkAdminUsername = await Admin.checkAdminUsername(username);
        if (checkAdmin != null || checkAdminUsername != null) {
            return;
        }
        const adminAccess = await app.model.query("SELECT 'access' FROM admins WHERE userId = ?", {
            replacements: [ admin ] });
        if (adminAccess === '1' || adminAccess < access) {
            return '0';
        }
        await this.create({
            userId,
            password: pehelper.encryptBySalt(password),
            // 用户名
            username,
            // 默认头像
            avatar: 'http://127.0.0.1:8089/avatar/defaultAvatar.jpg',
            // 默认没有描述
            access,
            status: '1',
        });
        return '1';
    };

    // 更改管理员头像
    Admin.changeAvator = async function(userId, avatar) {
        const admin = await this.findOne({
            where: {
                userId,
            },
        });
        if (admin == null) {
            return;
        }
        await this.update({
            avatar,
        }, {
            where: {
                userId,
            },
        });
        return admin.dataValues.avatar;
    };

    // 修改管理员个人信息
    Admin.changeAdminInfo = async function({ username, oldUsername }, userId) {
        const admin = await this.findOne({
            where: {
                username: oldUsername,
            },
        });
        if (admin == null) {
            return '0';
        }
        if (admin.dataValues.userId !== userId) {
            return '0';
        }
        await this.update({
            username,
        }, {
            where: {
                userId,
            },
        });
        return '1';
    };

    Admin.deleteAdmin = async function(userId, token) {
        const executeObj = await this.findOne({
            where: {
                userId,
            },
        });
        // 执行对象不存在就返回
        if (executeObj == null) {
            return '0';
        }
        const accessTag = Admin.checkAccess(token, executeObj.dataValues.access);
        // 权限不够就返回
        if (accessTag === true) {
            return '0';
        }
        await this.destroy({
            where: {
                userId,
            },
        });
        return '1';
    };

    return Admin;
};
