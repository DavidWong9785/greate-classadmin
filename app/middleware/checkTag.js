'use strict';

module.exports = (app, check) => {
    return async function checkTag(ctx, next) {
        // 如果用户级别与参数check不相等，就返回
        const loginUser = ctx.cookies.get('loginUser', {
            signed: false,
        });
        const courseId = ctx.cookies.get('courseId', {
            signed: false,
        });
        const { dataValues } = await ctx.model.User.checkUser(loginUser);
        if (dataValues.tag !== check) {
            ctx.body = {
                code: 0,
            };
            return;
        }
        if (ctx.request.url != '/teacherGetCourseInfo' && check == '2') {
            const data = await ctx.model.Teacher.checkTeacher(loginUser, courseId);
            if (data == undefined || data == null) {
                return;
            }
        }
        await next();
    };
};

