'use strict';

module.exports = app => {
    return async function checkLogin(ctx, next) {
        const loginTag = ctx.cookies.get('EGG_CHECK', {
            signed: false,
        });
        // 如果客户端没有，禁止访问
        if (loginTag === undefined) {
            ctx.body = {
                code: 0,
            };
            return;
        }
        // 如果不匹配，也禁止访问
        const loginkey = await app.redis.get('loginkey').get(ctx.cookies.get('loginUser', {
            signed: false,
        }));
        if (loginTag !== loginkey) {
            ctx.body = {
                code: 0,
            };
            return;
        }
        await next();
    };
};

