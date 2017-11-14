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
  };
};
