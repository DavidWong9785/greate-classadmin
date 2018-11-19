'use strict';

module.exports = app => {
    // 校验邮箱
    app.validator.addRule('mail', (rule, value, ctx) => {
        try {
            const patt = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
            const tag = patt.test(value);
            if (tag === false) {
                throw new Error();
            }
        } catch (err) {
            ctx.body = '0';
            return;
        }
    });
    // 校验密码
    app.validator.addRule('pass', (rule, value, ctx) => {
        try {
            const patt = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
            const tag = patt.test(value);
            if (tag === false) {
                throw new Error();
            }
        } catch (err) {
            ctx.body = '0';
            return;
        }
    });
    // 校验用户名
    app.validator.addRule('username', (rule, value, ctx) => {
        try {
            const patt = /^[0-9a-zA-Z\u4e00-\u9fa5_]{5,15}$/;
            if (patt.test(value) === false) {
                throw new Error();
            }
        } catch (err) {
            ctx.body = '0';
            return;
        }
    });
    // 校验老师名字
    app.validator.addRule('teacherName', (rule, value, ctx) => {
        try {
            const patt = /^[0-9a-zA-Z\u4e00-\u9fa5_]{3,10}$/;
            if (patt.test(value) === false) {
                throw new Error();
            }
        } catch (err) {
            ctx.body = '0';
            return;
        }
    });
    // 校验课程名字
    app.validator.addRule('courseName', (rule, value, ctx) => {
        try {
            const patt = /^[0-9a-zA-Z\u4e00-\u9fa5_]{3,15}$/;
            if (patt.test(value) === false) {
                throw new Error();
            }
        } catch (err) {
            ctx.body = '0';
            return;
        }
    });
    // 校验课程介绍字数
    app.validator.addRule('courseDesc', (rule, value, ctx) => {
        try {
            if (value.length > 200) {
                throw new Error();
            }
        } catch (err) {
            ctx.body = '0';
            return;
        }
    });
};
