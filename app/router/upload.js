'use strict';

module.exports = app => {
    const checkLogin = app.middleware.checkLogin(app);
    const checkAdminLogin = app.middleware.checkAdminLogin(app);
    // 上传管理员头像
    app.router.post('/uploadAvator', checkAdminLogin, app.controller.upload.uploadAvatorController.uploadAvator);
    // 上传用户课程申报文档
    app.router.post('/handleApplyDoc', checkLogin, app.controller.upload.uploadApplyDocController.uploadApplyDoc);
};
