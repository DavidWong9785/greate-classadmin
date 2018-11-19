var crypto = require('crypto');
function getRandomSalt(){
    return Math.random().toString().slice(2, 5);
}
module.exports = {
    sha1 : (str) => {
        return crypto.createHash('sha1').update(str).digest('hex');
    },
    md5 : (str) => {
        return crypto.createHash('md5').update(str).digest('hex');
    },
    saltyMd5 : (str,salt) => {
        return crypto.createHash('md5').update(str + ':' + salt).digest('hex');
    },
    randomSalty : (str) => {
        return crypto.createHash('md5').update(str + ':' + getRandomSalt()).digest('hex');
    }
}