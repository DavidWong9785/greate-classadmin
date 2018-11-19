'use strict';
const fs = require('fs');

const readFile = filePath => {
    return new Promise((resolve, reject) => {
        try {
            // let readStream = null;
            const readStream = fs.createReadStream(filePath, { encoding: 'utf-8' });
            readStream.on('data', data => {
                data = JSON.parse(data);
                resolve(data);
            });
            readStream.on('error', err => {
                readStream.close();
                reject('???');
            });
        } catch (error) {
            throw new Error(error);
        }
    });
};

module.exports = {
    read: readFile,
};
