'use strict';

const is = require('is-type-of');
const defaultErrorCode = require('../config/errorcode');

function isProd(app) {
  return app.config.env !== 'local' && app.config.env !== 'unittest';
}

exports.isProd = isProd;

exports.getCodeConfig = function(ctx, error, config) {
  const { errorcode, sendClientAllParams } = config;

  let codeConfig = (errorcode || defaultErrorCode)[error.code];

  if (is.function(codeConfig)) {
    codeConfig = codeConfig.call(ctx, ctx, error);

    if (codeConfig === false) {
      codeConfig = { breakDefault: true };
    }
  }

  if (!codeConfig) {
    ctx.coreLogger.warn('[BizError] not found error code config', error);
    codeConfig = defaultErrorCode.SYSTEM_EXCEPTION;
  }

  // copy
  codeConfig = Object.assign({}, codeConfig);

  if (is.function(codeConfig.errorPageUrl)) {
    codeConfig.errorPageUrl = codeConfig.errorPageUrl.call(ctx, ctx, error);
  }

  if (error.bizParams) {
    const sendClient = Object.assign({}, error.bizParams.sendClient);

    if (!isProd(ctx.app) || sendClientAllParams === true) {
      Object.keys(error.bizParams).forEach(key => {
        if (key !== 'sendClient') {
          sendClient[key] = error.bizParams[key];
        }
      });
    }

    if (Object.keys(sendClient).length > 0) {
      codeConfig.errors = sendClient;
    }
  }

  // ensure has code and message
  codeConfig = Object.assign(
    {
      code: error.code,
      message: error.message,
    },
    codeConfig
  );

  return codeConfig;
};
