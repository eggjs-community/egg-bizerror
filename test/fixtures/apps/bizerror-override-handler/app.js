'use strict';

module.exports = app => {
  app.BizErrorHandler = class extends app.BizErrorHandler {
    json(ctx, error, config) {
      ctx.body = {
        code: config.code,
        msg: config.message,
        override: true,
      };
    }
  };
};
