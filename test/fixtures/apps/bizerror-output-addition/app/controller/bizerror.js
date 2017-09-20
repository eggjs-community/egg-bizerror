'use strict';

module.exports = app => {
  return class extends app.Controller {
    * throwError() {
      this.ctx.throwBizError('USER_NOT_EXIST', { id: 1, step: 2 });
    }

    * responseBizError() {
      try {
        throw new Error('this is a biz error');
      } catch (error) {
        this.ctx.responseBizError(error, { bizError: true, id: 1, step: 2 });
      }
    }
  };
};
