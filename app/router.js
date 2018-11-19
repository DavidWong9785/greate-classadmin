'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/', controller.home.index);
    require('./router/upload')(app); // 上传模块
    require('./router/user')(app); // 用户模块
    require('./router/authcode')(app); // 验证码模块
    require('./router/superadmin')(app); // 管理员模块
    require('./router/teacher')(app); // 老师模块
};
