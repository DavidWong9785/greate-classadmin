'use strict';

module.exports = app => {
    const checkLogin = app.middleware.checkLogin(app);
    const checkTag = app.middleware.checkTag;
    // 获取老师基本信息
    app.router.post('/teacherGetCourseInfo', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.getCourseInfo);
    // 修改课程描述
    app.router.post('/teacherChangeCourseDesc', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherChangeCourseController.changeCourseDesc);
    // 修改老师描述
    app.router.post('/teacherChangeTeacherDesc', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherChangeCourseController.changeTeacherDesc);
    // 添加章
    app.router.post('/teacherAddChapter', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addChapter);
    app.router.options('/teacherAddChapter', app.controller.teacher.teacherAddCourseController.options);
    // 添加节
    app.router.post('/teacherAddSection', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addSection);
    app.router.options('/teacherAddSection', app.controller.teacher.teacherAddCourseController.options);
    // 删除章
    app.router.post('/teacherRemoveChapter', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherRemoveCourseController.removeChapter);
    app.router.options('/teacherRemoveChapter', app.controller.teacher.teacherRemoveCourseController.options);
    // 删除节
    app.router.post('/teacherRemoveSection', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherRemoveCourseController.removeSection);
    app.router.options('/teacherRemoveSection', app.controller.teacher.teacherRemoveCourseController.options);
    // 检查章节名是否已经存在
    app.router.post('/teacherCheckCSName', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.checkCSName);
    app.router.options('/teacherCheckCSName', app.controller.teacher.teacherGetCourseController.options);
    // 获取课程列表
    app.router.post('/teacherGetCourseList', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.getCourseList);
    app.router.options('/teacherGetCourseList', app.controller.teacher.teacherGetCourseController.options);
    // 添加视频
    app.router.post('/teacherAddVideo', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addVideo);
    app.router.options('/teacherAddVideo', app.controller.teacher.teacherAddCourseController.options);
    // 合并视频
    app.router.post('/mergeVideo', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.mergeVideo);
    app.router.options('/mergeVideo', app.controller.teacher.teacherAddCourseController.options);
    // 课件上传
    app.router.post('/teacherAddPPT', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addPPT);
    app.router.options('/teacherAddPPT', app.controller.teacher.teacherAddCourseController.options);
    // 添加试题
    app.router.post('/teacherAddQuestion', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addQuestion);
    app.router.options('/teacherAddQuestion', app.controller.teacher.teacherAddCourseController.options);
    // 获取试题列表
    app.router.post('/teacherGetQuestionList', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.getQuestionList);
    app.router.options('/teacherGetQuestionList', app.controller.teacher.teacherGetCourseController.options);
    // 删除试题
    app.router.post('/teacherRemoveQuestion', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherRemoveCourseController.removeQuestion);
    app.router.options('/teacherRemoveQuestion', app.controller.teacher.teacherRemoveCourseController.options);
    // 修改试题
    app.router.post('/teacherChangeQuestion', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherChangeCourseController.changeQuestion);
    app.router.options('/teacherChangeQuestion', app.controller.teacher.teacherChangeCourseController.options);
    // 获取试题列表(过滤某些qId)
    app.router.post('/teacherGetQuestionListFilterQid', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.getQuestionListFilterQid);
    app.router.options('/teacherGetQuestionListFilterQid', app.controller.teacher.teacherGetCourseController.options);
    // 添加试题到练习
    app.router.post('/teacherAddQuestionToPractice', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addQuestionToPractice);
    app.router.options('/teacherAddQuestionToPractice', app.controller.teacher.teacherAddCourseController.options);
    // 从练习移除试题
    app.router.post('/teacherRemoveQuestionFromPractice', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherRemoveCourseController.removeQuestionFromPractice);
    app.router.options('/teacherRemoveQuestionFromPractice', app.controller.teacher.teacherRemoveCourseController.options);
    // 修改章名称
    app.router.post('/teacherChangeChapterName', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherChangeCourseController.changeChapterName);
    app.router.options('/teacherChangeChapterName', app.controller.teacher.teacherChangeCourseController.options);
    // 修改节名称
    app.router.post('/teacherChangeSectionName', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherChangeCourseController.changeSectionName);
    app.router.options('/teacherChangeSectionName', app.controller.teacher.teacherChangeCourseController.options);
    // 修改节名称
    app.router.post('/teacherAddPoster', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherAddCourseController.addPoster);
    // 获取课程内容detail
    app.router.post('/teacherGetCourseDetailBysectionId', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.teacherGetCourseDetailBysectionId);
    app.router.options('/teacherGetCourseDetailBysectionId', app.controller.teacher.teacherGetCourseController.options);
    // 创建试卷
    app.router.post('/teacherCreateExamPaper', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.createExamPaper);
    app.router.options('/teacherCreateExamPaper', app.controller.teacher.teacherHandleExamController.options);
    // 检查考卷名是否已经存在
    app.router.post('/checkPaperName', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.checkPaperName);
    app.router.options('/checkPaperName', app.controller.teacher.teacherHandleExamController.options);
    // 获取考卷列表
    app.router.post('/teacherGetPaperList', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetPaperList);
    app.router.options('/teacherGetPaperList', app.controller.teacher.teacherHandleExamController.options);
    // 获取考卷详情
    app.router.post('/teacherGetPaperDetail', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetPaperDetail);
    app.router.options('/teacherGetPaperDetail', app.controller.teacher.teacherHandleExamController.options);
    // 根据过滤规则查找试题列表
    app.router.post('/teacherGetQuestionListByFilter', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetQuestionListByFilter);
    app.router.options('/teacherGetQuestionListByFilter', app.controller.teacher.teacherHandleExamController.options);
    // 老师添加试题到考卷
    app.router.post('/teacherAddQuestionToPaper', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherAddQuestionToPaper);
    app.router.options('/teacherAddQuestionToPaper', app.controller.teacher.teacherHandleExamController.options);
    // 老师修改考卷里的题目
    app.router.post('/teacherUpdateQuestionToPaper', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherUpdateQuestionToPaper);
    app.router.options('/teacherUpdateQuestionToPaper', app.controller.teacher.teacherHandleExamController.options);
    // 老师删除考卷
    app.router.post('/teacherDeletePaper', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherDeletePaper);
    app.router.options('/teacherDeletePaper', app.controller.teacher.teacherHandleExamController.options);
    // 老师添加考试
    app.router.post('/teacherAddExam', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherAddExam);
    app.router.options('/teacherAddExam', app.controller.teacher.teacherHandleExamController.options);
    // 老师根据条件获取考试列表
    app.router.post('/teacherGetExamList', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetExamList);
    app.router.options('/teacherGetExamList', app.controller.teacher.teacherHandleExamController.options);
    // 老师获取待批改考卷列表
    app.router.post('/teacherGetExamCorrectList', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetExamCorrectList);
    app.router.options('/teacherGetExamCorrectList', app.controller.teacher.teacherHandleExamController.options);
    // 老师获取待修改的考卷详情
    app.router.post('/teacherGetExamCorrectDetail', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetExamCorrectDetail);
    app.router.options('/teacherGetExamCorrectDetail', app.controller.teacher.teacherHandleExamController.options);
    // 老师改完卷
    app.router.post('/teacherFinishCorrect', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherFinishCorrect);
    app.router.options('/teacherFinishCorrect', app.controller.teacher.teacherHandleExamController.options);
    // 老师获取学生信息
    app.router.post('/teacherGetStudentInfo', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherHandleExamController.teacherGetStudentInfo);
    app.router.options('/teacherGetStudentInfo', app.controller.teacher.teacherHandleExamController.options);
    // 老师获取学生信息
    app.router.post('/teacherGetCountInfo', checkLogin, checkTag(app, '2'), app.controller.teacher.teacherGetCourseController.teacherGetCountInfo);
    app.router.options('/teacherGetCountInfo', app.controller.teacher.teacherGetCourseController.options);
};
