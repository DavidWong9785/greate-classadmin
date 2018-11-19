'use strict';
const crypto = require('crypto');
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const fs = require('fs');

module.exports = {
    save(basePath, salty, stream) {
        // 生成文件名 (时间 + 盐 + 10000以内的随机数 + 文件名后缀的MD5格式hash)
        const filename = crypto.createHash('md5').update(Date.now() + ':' + salty + Number.parseInt(Math.random() * 10000) + path.extname(stream.filename)).digest('hex') + path.extname(stream.filename);
        // // 生成文件夹
        // const dirName = dayjs(Date.now()).format('YYYYMMDD');
        // if( !fs.existsSync() ) fs.mkdirSync(path.join(this.config.baseDir, uplaodBasePath, dirName));
        // // 生成写入路径
        // const target = path.join(this.config.baseDir, uplaodBasePath, dirName, filename);
        const target = path.join(basePath, filename);
        // 写入流
        const writeStream = fs.createWriteStream(target);
        try {
            // 写入文件
            // await awaitStreamReady(stream.pipe(writeStream));
            stream.pipe(writeStream);
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            sendToWormhole(stream);
            throw err;
        }
        return filename;
    },
};
