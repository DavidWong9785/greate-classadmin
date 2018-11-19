'use strict';

module.exports = () => {
    return async function accessCross(ctx, next) {
        await next();
        // ctx.set('Access-Control-Allow-Origin', 'http://localhost:8080');
        ctx.set('Access-Control-Allow-Credentials', true);
    };
};

