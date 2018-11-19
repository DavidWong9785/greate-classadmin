'use strict';
const crypto = require('crypto');

// 客户端登录之后会把一个加密的cookie返回作为登录凭证，没有这个凭证是无法访问需要登录的api
module.exports = {
    encryptBySalt(mail) {
        return crypto.createHash('sha1').update(crypto.createHash('md5').update(mail + ':login').digest('hex')).digest('hex');
    },
};
