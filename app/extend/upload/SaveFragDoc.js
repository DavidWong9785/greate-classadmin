'use strict';
const crypto = require('crypto');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');

module.exports = {
    save(basePath, index, stream) {
        // 生成文件名 (时间 + 盐 + 10000以内的随机数 + 文件名后缀的MD5格式hash)
        const filename = (index < 9 ? '0' + index : index) + path.extname(stream.filename);
        // 生成文件夹
        const dirName = 'chunks';
        try {
            if (!fs.existsSync(basePath + '/' + dirName)) {
                fs.mkdirSync(basePath + '/' + dirName);
            }
        } catch (error) {
            throw new Error(error);
        }

        const target = basePath + '/' + dirName + '/' + filename;

        // 写入流
        const writeStream = fs.createWriteStream(target);
        try {
            // 写入文件
            // await awaitStreamReady(stream.pipe(writeStream));
            stream.pipe(writeStream);
            // writeStream.close();
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            sendToWormhole(stream);
            throw err;
        }
        return filename;
    },
};
