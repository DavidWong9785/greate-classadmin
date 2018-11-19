'use strict';
const crypto = require('crypto');

module.exports = {
    encryptBySalt(pass) {
        return crypto.createHash('md5').update(pass + ':userpasswd').digest('hex');
    },
};
