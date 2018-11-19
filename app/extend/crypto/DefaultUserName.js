'use strict';
const crypto = require('crypto');

module.exports = {
    generateName(str) {
        const defaultName = crypto.createHash('md5').update(str + ':defaultName').digest('hex');
        return defaultName.substring(defaultName.length, defaultName.length - 10);
    },
};
