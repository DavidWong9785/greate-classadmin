'use strict';
const fs = require('fs');
const nodeCmd = require('node-cmd');
const path = require('path');
const cluster = require('cluster');

const forceRemove = function(dirPath) {
    const exec = require('child_process').exec;
    exec('rimraf ' + dirPath, function(err) {
        console.log(err);
    });
};

const removeDir = function(dirPath, app) {
    forceRemove(dirPath);
};

module.exports = {
    remove: removeDir,
    forceRemove,
};
