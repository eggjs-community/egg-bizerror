'use strict';

module.exports = app => {
  return class extends app.Controller {
    async throwError() {
      this.ctx.throwBizError('USER_NOT_EXIST');
    }

    async responseBizError() {
      try {
        throw new Error('this is a biz error');
      } catch (error) {
        this.ctx.responseBizError(error, { bizError: true });
      }
    }

    async responseNoBizError() {
      throw new Error('this is not a biz error');
    }

    async redirectErrorPage() {
      this.ctx.throwBizError('PARAMS_ERROR');
    }

    async notFoundData() {
      this.ctx.throwBizError('NOT_FOUND_DATA');
    }

    async notFoundPage() {
      this.ctx.throwBizError('NOT_FOUND_PAGE');
    }
  };
};
