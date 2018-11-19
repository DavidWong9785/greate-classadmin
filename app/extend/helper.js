'use strict';

// hash
const MailAuthcode = require('./crypto/MailAuthcode');
const DefaultUserName = require('./crypto/DefaultUserName');
const LoginEncrypt = require('./crypto/LoginEncrypt');
const SaltyMd5 = require('./crypto/SaltyMd5');
const SaltySha1 = require('./crypto/SaltySha1');
// 邮件发送和保存文件
const SendMail = require('./mail/SendMail');
const SaveDoc = require('./upload/SaveDoc');
const SaveFragDoc = require('./upload/SaveFragDoc');
// 文件流操作
const read = require('./file/read');
const write = require('./file/write');
const remove = require('./file/remove');
const mkdir = require('./file/mkdir');
const merge = require('./file/merge');

module.exports = {
    // 生成邮箱注册验证码
    getMailAuthcode() {
        return MailAuthcode.generateCode();
    },
    // 发送注册码邮件
    mailSend(code, mail) {
        return SendMail.send(code, mail);
    },
    // 获取默认用户名
    getDefaultUserName(mail) {
        return DefaultUserName.generateName(mail);
    },
    // 加密鉴权cookie
    encryptLoginCookies(str) {
        return LoginEncrypt.encryptBySalt(str);
    },
    // 保存文件
    handleSaveDoc(basePath, salty, stream) {
        return SaveDoc.save(basePath, salty, stream);
    },
    // 保存分片文件
    handleSaveFragDoc(basePath, index, stream) {
        return SaveFragDoc.save(basePath, index, stream);
    },
    // md5加盐hash
    getSaltyMd5(str, salty) {
        return SaltyMd5.encryptBySalt(str, salty);
    },
    // sha1加盐hash
    getSaltySha1(str, salty) {
        return SaltySha1.encryptBySalt(str, salty);
    },
    // 读文件
    readFile(filePath) {
        return read.read(filePath);
    },
    // 写文件
    writeFile(filePath, fileData) {
        return write.write(filePath, fileData);
    },
    // 删除整个文件夹
    removeDir(filePath, app) {
        return remove.remove(filePath, app);
    },
    // 强制删除
    forceRemove(filePath) {
        return remove.forceRemove(filePath);
    },
    // 创建文件夹
    makeDir(filePath) {
        return mkdir.mkdir(filePath);
    },
    // 合并文件
    mergeFrag(dirName, fileName, chunks) {
        return merge.mergeChunks(dirName, fileName, chunks);
    },
};
