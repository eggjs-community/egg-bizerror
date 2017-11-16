'use strict';

const is = require('is-type-of');
const defaultErrorCode = require('../config/errorcode');

exports.isProd = function(app) {
  return app.config.env !== 'local' && app.config.env !== 'unittest';
};

exports.getCodeConfig = function(error, config, ctx) {
  const { errorcode } = config;

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

  if (is.function(codeConfig.errorPageUrl)) {
    codeConfig.errorPageUrl = codeConfig.errorPageUrl.call(ctx, ctx, error);
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
