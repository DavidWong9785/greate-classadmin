'use strict';

const forceRemove = function(dirPath) {
    const exec = require('child_process').exec;
    exec('rimraf ' + dirPath, function(err) {
        console.log(err);
    });
};

module.exports = agent => {
    agent.messenger.on('removeFloder', (data) => {
        try {
            forceRemove(data);
        } catch (error) {
            throw new Error(error);
        }
    });
};
