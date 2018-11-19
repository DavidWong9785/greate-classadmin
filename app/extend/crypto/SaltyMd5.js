'use strict';
const crypto = require('crypto');

module.exports = {
    encryptBySalt(str, salty) {
        return crypto.createHash('md5').update(str + ':' + salty).digest('hex');
    },
};
