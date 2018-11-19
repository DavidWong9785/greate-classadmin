'use strict';

module.exports = {
    generateCode() {
        let code = '';
        for (let i = 0; i < 5; i++) {
            code += Math.floor(Math.random() * 10);
        }
        return code;
    },
};
