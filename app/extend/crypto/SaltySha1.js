'use strict';
const crypto = require('crypto');

module.exports = {
    encryptBySalt(str, salty) {
        return crypto.createHash('sha1').update(str + ':' + salty).digest('hex');
    },
};
