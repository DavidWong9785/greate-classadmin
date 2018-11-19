'use strict';

module.exports = appInfo => {
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1535760123202_3811';

    // add your config here
    config.middleware = [ 'accessCross' ];

    // egg安全模块
    config.security = {
        csrf: {
            enable: false,
            // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
            // useSession: true, // 默认为 false，当设置为 true 时，将会把 csrf token 保存到 Session 中
            // cookieName: 'csrfToken', // Cookie 中的字段名，默认为 csrfToken
            // sessionName: 'csrfToken', // Session 中的字段名，默认为 csrfToken
        },
        domainWhiteList: [ 'http://localhost:8080', 'http://localhost:8081' ],
    };
    config.cors = {
        // origin: 'http://localhost:8080',
        credentials: true,
    };

    config.redis = {
        clients: {
            registercode: {
                port: 6379,
                host: '127.0.0.1',
                password: 'zjxwl41168751423',
                db: 0,
            },
            loginkey: {
                port: 6380,
                host: '127.0.0.1',
                password: 'zjxwl41168751423',
                db: 1,
            },
            count: {
                port: 6381,
                host: '127.0.0.1',
                password: 'zjxwl41168751423',
                db: 2,
            },
            noName1: {
                port: 6382,
                host: '127.0.0.1',
                password: 'zjxwl41168751423',
                db: 3,
            },
            noName2: {
                port: 6383,
                host: '127.0.0.1',
                password: 'zjxwl41168751423',
                db: 4,
            },
            noName3: {
                port: 6384,
                host: '127.0.0.1',
                password: 'zjxwl41168751423',
                db: 5,
            },
        },
    };

    config.sequelize = {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        database: 'olclass',
        username: 'root',
        password: 'zjxwl41168751423',
    };

    config.session = {
        key: 'EGG_SESS',
        maxAge: 24 * 3600 * 1000,
        httpOnly: true,
        encrypt: false,
    };

    config.multipart = {
        whitelist: [
            '.png',
            '.jpg',
            '.jpeg',
            '.doc',
            '.docx',
            '.avi',
            '.mp4',
            '.ppt',
            '.pptx',
        ],
    };

    return config;
};
