'use strict';

// had enabled by egg
// exports.static = true;
exports.cors = {
    enable: true,
    package: 'egg-cors',
};
exports.redis = {
    enable: true,
    package: 'egg-redis',
};
exports.sequelize = {
    enable: true,
    package: 'egg-sequelize',
};
exports.validate = {
    enable: true,
    package: 'egg-validate',
};
exports.session = {
    key: 'EGG_SESS',
    maxAge: 0,
    httpOnly: true,
    encrypt: true,
};

