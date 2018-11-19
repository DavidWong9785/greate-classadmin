'use strict';
const fs = require('fs');
const path = require('path');

// 合并分片
function mergeChunks(dirName, fileName, chunks) {
    const chunkPaths = chunks.map(function(name) {
        return path.join(dirName, 'chunks', name);
    });
    // 采用Stream方式合并
    const targetStream = fs.createWriteStream(fileName);
    const readStream = function(chunkArray) {
        const path = chunkArray.shift();
        const originStream = fs.createReadStream(path);
        originStream.pipe(targetStream, { end: false });
        originStream.on('end', function() {
            // 删除文件
            fs.unlinkSync(path);
            if (chunkArray.length > 0) {
                readStream(chunkArray);
            } else {
                targetStream.close();
                originStream.close();
            }
        });
    };
    readStream(chunkPaths);
}

module.exports = {
    mergeChunks,
};
