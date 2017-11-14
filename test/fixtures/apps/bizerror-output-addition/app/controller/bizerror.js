'use strict';

module.exports = app => {
  return class extends app.Controller {
    async throwError() {
      this.ctx.throwBizError('USER_NOT_EXIST', { id: 1, step: 2 });
    }

    async responseBizError() {
      try {
        throw new Error('this is a biz error');
      } catch (error) {
        this.ctx.responseBizError(error, { bizError: true, id: 1, step: 2 });
      }
    }

    async unexpectedError() {
      throw new Error('this is a unexpected error');
    }
  };
};
