'use strict';

module.exports = app => {
    app.router.get('/registercode', app.controller.authcode.registerCodeController.index);
};
