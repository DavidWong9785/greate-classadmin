'use strict';

module.exports = app => {
    const checkAdminLogin = app.middleware.checkAdminLogin(app);
    // 添加管理员
    app.router.post('/adminAdd', app.controller.superadmin.superAdminAddController.index);
    app.router.options('/adminAdd', app.controller.superadmin.superAdminAddController.options); // 用于处理post复杂请求的预处理
    // 检查管理员id是否已经注册
    app.router.get('/checkAdmin/:id', app.controller.superadmin.superAdminAddController.checkAdmin);
    // 检查管理员名字是否已经存在
    app.router.get('/checkAdminUsername/:username', app.controller.superadmin.superAdminAddController.checkAdminUsername);
    // 登录
    app.router.post('/adminLogin', app.controller.superadmin.superAdminLoginController.index);
    app.router.options('/adminLogin', app.controller.superadmin.superAdminLoginController.options); // 用于处理post复杂请求的预处理
    app.router.post('/adminhavebeenlogin', checkAdminLogin, app.controller.superadmin.superAdminLoginController.adminhavebeenlogin); // 用于处理自动登录的请求
    // 获取管理员列表(没有自己)
    app.router.post('/getAdminList/:access', checkAdminLogin, app.controller.superadmin.superAdminManageController.getAdminList);
    // 锁定管理员
    app.router.post('/lockAdmin/:id', checkAdminLogin, app.controller.superadmin.superAdminManageController.lockAdmin);
    app.router.options('/lockAdmin', checkAdminLogin, app.controller.superadmin.superAdminManageController.options);
    // 解锁管理员
    app.router.post('/unLockAdmin/:id', checkAdminLogin, app.controller.superadmin.superAdminManageController.unLockAdmin);
    app.router.options('/unLockAdmin', checkAdminLogin, app.controller.superadmin.superAdminManageController.options);
    // 管理员升级
    app.router.post('/upgradeAdmin/:id', checkAdminLogin, app.controller.superadmin.superAdminManageController.upgradeAdmin);
    app.router.options('/upgradeAdmin', checkAdminLogin, app.controller.superadmin.superAdminManageController.options);
    // 管理员降级
    app.router.post('/demoteAdmin/:id', checkAdminLogin, app.controller.superadmin.superAdminManageController.demoteAdmin);
    app.router.options('/demoteAdmin', checkAdminLogin, app.controller.superadmin.superAdminManageController.options);
    // 修改管理员个人信息
    app.router.post('/changeAdminInfo', checkAdminLogin, app.controller.superadmin.superAdminManageController.changeAdminInfo);
    app.router.options('/changeAdminInfo', checkAdminLogin, app.controller.superadmin.superAdminManageController.options);
    // 删除管理员
    app.router.post('/deleteAdmin/:id', checkAdminLogin, app.controller.superadmin.superAdminManageController.deleteAdmin);
    // 获取申报列表
    app.router.post('/getApplyList/:status', checkAdminLogin, app.controller.superadmin.superAdminHandleApplyController.getApplyList);
    // 申报通过
    app.router.post('/acceptApply/:id', checkAdminLogin, app.controller.superadmin.superAdminHandleApplyController.acceptApply);
    // 申报打回
    app.router.post('/backApply/:id', checkAdminLogin, app.controller.superadmin.superAdminHandleApplyController.backApply);
    app.router.options('/backApply/:id', app.controller.superadmin.superAdminHandleApplyController.options);
    // 删除申报
    app.router.post('/removeApply/:id', checkAdminLogin, app.controller.superadmin.superAdminHandleApplyController.removeApply);
    // 获取视频审核列表
    app.router.get('/superadminGetVideoApplyList', checkAdminLogin, app.controller.superadmin.superAdminHandleVideoApplyController.getVideoApplyList);
    // 通过视频
    app.router.post('/superadminAcceptVideoApply', checkAdminLogin, app.controller.superadmin.superAdminHandleVideoApplyController.acceptApply);
    app.router.options('/superadminAcceptVideoApply', app.controller.superadmin.superAdminHandleVideoApplyController.options);
    // 不通过视频
    app.router.post('/superadminBackVideoApply', checkAdminLogin, app.controller.superadmin.superAdminHandleVideoApplyController.backApply);
    app.router.options('/superadminBackVideoApply', app.controller.superadmin.superAdminHandleVideoApplyController.options);
};
