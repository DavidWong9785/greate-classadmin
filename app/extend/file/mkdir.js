'use strict';
const fs = require('fs');

const mkdir = function(dirPath) {
    fs.mkdirSync(dirPath);
};

module.exports = {
    mkdir,
};
