'use strict';

module.exports = () => {
  return async function(ctx, next) {
    try {
      await next();
    } catch (error) {
      ctx.responseBizError(error);
    }
  };
};
