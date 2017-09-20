'use strict';

const path = require('path');
const BizErrorHandler = require('./handler');

module.exports = app => {
  // load errorcode info
  const config = app.config.bizerror;
  const errorCodeList = app.loader.getLoadUnits().map(unit => app.loader.loadFile(path.join(unit.path, 'config', 'errorcode.js')));

  config.errorcode = Object.assign({}, config.errorcode, ...errorCodeList);

  app.BizErrorHandler = BizErrorHandler;

  let handler;
  app.on('responseBizError', (...args) => {
    if (!handler) {
      handler = new app.BizErrorHandler(app);
    }

    handler.responseError(...args);
  });

  app.config.coreMiddleware.push('bizerror');
};
