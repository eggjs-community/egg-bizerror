'use strict';

module.exports = app => {
  app.BizErrorHandler = class extends app.BizErrorHandler {
    json(ctx, error, responseInfo) {
      ctx.body = {
        code: responseInfo.code,
        msg: responseInfo.message,
        override: true,
      };
    }
  };
};
