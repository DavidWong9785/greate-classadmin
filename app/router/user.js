'use strict';

module.exports = app => {
    const checkLogin = app.middleware.checkLogin(app);
    const checkTag = app.middleware.checkTag;
    // 注册
    app.router.post('/register', app.controller.user.userRegisterController.index);
    app.router.options('/register', app.controller.user.userRegisterController.options); // 用于处理post复杂请求的预处理
    // 检查用户是否已经注册
    app.router.get('/checkUser/:mail', app.controller.user.userRegisterController.checkUser);
    // 检查用户名是否已经存在
    app.router.get('/checkUsername/:username', app.controller.user.userRegisterController.checkUsername);
    // 登录
    app.router.post('/login', app.controller.user.userLoginController.index);
    app.router.options('/login', app.controller.user.userLoginController.options);
    app.router.post('/havebeenlogin', checkLogin, app.controller.user.userLoginController.haveBeenLogin); // 用于处理自动登录的请求
    // 上传申报信息
    app.router.post('/handleApply', checkLogin, checkTag(app, '1'), app.controller.user.userApplyController.handleApply);
    app.router.options('/handleApply', app.controller.user.userApplyController.options);
    // 获取申报信息
    app.router.post('/getApplyInfo', checkLogin, checkTag(app, '1'), app.controller.user.userApplyController.getApplyInfo);
    // 校验老师名字是否已经存在
    app.router.post('/checkTeacherName', checkLogin, checkTag(app, '1'), app.controller.user.userApplyController.checkTeacherName);
    app.router.options('/checkTeacherName', app.controller.user.userApplyController.options);
    // 校验课程名字是否已经存在
    app.router.post('/checkCourseName', checkLogin, checkTag(app, '1'), app.controller.user.userApplyController.checkCourseName);
    app.router.options('/checkCourseName', app.controller.user.userApplyController.options);
    // 校验课程名字是否已经存在
    app.router.get('/userGetCourseList', app.controller.user.userLearningController.userGetCourseList);
    // 查找课程信息
    app.router.get('/userGetCourseIntroduce/:id', app.controller.user.userLearningController.userGetCourseIntroduce);
    // 检查用户是否已经参加了本课程学习
    app.router.post('/userCheckHaveAttend', app.controller.user.userLearningController.userCheckHaveAttend);
    app.router.options('/userCheckHaveAttend', app.controller.user.userLearningController.options);
    // 用户获取课程目录
    app.router.post('/userGetCourseCatalog', app.controller.user.userLearningController.userGetCourseCatalog);
    app.router.options('/userGetCourseCatalog', app.controller.user.userLearningController.options);
    // 用户参与课程学习
    app.router.post('/userAttendStudy', checkLogin, app.controller.user.userLearningController.userAttendStudy);
    app.router.options('/userAttendStudy', app.controller.user.userLearningController.options);
    // 用户获取课程目录(包括学习进度)
    app.router.post('/userGetCourseProgress', checkLogin, app.controller.user.userLearningController.userGetCourseProgress);
    app.router.options('/userGetCourseProgress', app.controller.user.userLearningController.options);
    // 用户获取学习资源
    app.router.post('/userGetLearningInfo', checkLogin, app.controller.user.userLearningController.userGetLearningInfo);
    app.router.options('/userGetLearningInfo', app.controller.user.userLearningController.options);
    // 视频观看进度监察
    app.router.post('/userWatchProgress', checkLogin, app.controller.user.userLearningController.userWatchProgress);
    app.router.options('/userWatchProgress', app.controller.user.userLearningController.options);
    // 检查用户练习题的状态（是否观看完视频，是否已完成练习题）
    app.router.post('/userCheckPracticeStatus', checkLogin, app.controller.user.userLearningController.userCheckPracticeStatus);
    app.router.options('/userCheckPracticeStatus', app.controller.user.userLearningController.options);
    // 用户提交练习（返回批改后的数据并记录到文件中）
    app.router.post('/userSubmitPractice', checkLogin, app.controller.user.userLearningController.userSubmitPractice);
    app.router.options('/userSubmitPractice', app.controller.user.userLearningController.options);
    // 判断是否有下一章或下一节
    app.router.post('/userCheckNextSection', checkLogin, app.controller.user.userLearningController.userCheckNextSection);
    app.router.options('/userCheckNextSection', app.controller.user.userLearningController.options);
    // 用户获取考试信息
    app.router.post('/userGetExamInfo', checkLogin, app.controller.user.userLearningController.userGetExamInfo);
    app.router.options('/userGetExamInfo', app.controller.user.userLearningController.options);
    // 用户报名考试
    app.router.post('/userAttendExam', checkLogin, app.controller.user.userLearningController.userAttendExam);
    app.router.options('/userAttendExam', app.controller.user.userLearningController.options);
    // 进入考试路由，判断是否已经报名了考试
    app.router.post('/userCheckHaveAttendExam', checkLogin, app.controller.user.userLearningController.userCheckHaveAttendExam);
    app.router.options('/userCheckHaveAttendExam', app.controller.user.userLearningController.options);
    // 用户获取考卷
    app.router.post('/userGetExamPaper', checkLogin, app.controller.user.userLearningController.userGetExamPaper);
    app.router.options('/userGetExamPaper', app.controller.user.userLearningController.options);
    // 用户离开了考试
    app.router.post('/userLeaveExam', checkLogin, app.controller.user.userLearningController.userLeaveExam);
    app.router.options('/userLeaveExam', app.controller.user.userLearningController.options);
    // 用户提交考卷
    app.router.post('/userSubmitExamPaper', checkLogin, app.controller.user.userLearningController.userSubmitExamPaper);
    app.router.options('/userSubmitExamPaper', app.controller.user.userLearningController.options);
    // 用户获取我的课程信息
    app.router.post('/userGetMyCourseInfo', checkLogin, app.controller.user.userLearningController.userGetMyCourseInfo);
    app.router.options('/userGetMyCourseInfo', app.controller.user.userLearningController.options);
    // 用户上传头像
    app.router.post('/userUploadAvatar', checkLogin, app.controller.user.userInfoController.userUploadAvatar);
    // 用户修改用户名
    app.router.post('/userChangeInfo', checkLogin, app.controller.user.userInfoController.userChangeInfo);
    app.router.options('/userChangeInfo', app.controller.user.userInfoController.options);
};
